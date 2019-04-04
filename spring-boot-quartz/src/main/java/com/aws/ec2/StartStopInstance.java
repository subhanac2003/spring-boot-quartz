package com.aws.ec2;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.PropertiesFileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.ec2.model.DescribeInstanceStatusRequest;
import com.amazonaws.services.ec2.model.DescribeInstanceStatusResult;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.DescribeInstancesResult;
import com.amazonaws.services.ec2.model.DryRunResult;
import com.amazonaws.services.ec2.model.DryRunSupportedRequest;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.InstanceStatus;
import com.amazonaws.services.ec2.model.RebootInstancesRequest;
import com.amazonaws.services.ec2.model.RebootInstancesResult;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.ec2.model.StartInstancesRequest;
import com.amazonaws.services.ec2.model.StopInstancesRequest;

public class StartStopInstance {
	 public static void startInstance(String instance_id) throws InterruptedException
	    {
	        //final AmazonEC2 ec2 = AmazonEC2ClientBuilder.defaultClient();
		 AWSCredentialsProvider credentialsProvider = new PropertiesFileCredentialsProvider(
	    			"src/main/resources/AwsCredentials.properties");
	        final AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
	        	     .withCredentials(credentialsProvider)
	        	     .withRegion(Regions.AP_SOUTHEAST_1)
	        	     .build();
	       // System.out.println(getAllInstances(ec2).size());
	        String currentStatus = getInstanceStatus(ec2, instance_id);
        	if(currentStatus != null && "running".equals(currentStatus)) {
        		System.out.println("\nAlready Running");
        		return;
        	}
        	
	        DryRunSupportedRequest<StartInstancesRequest> dry_request =
	            () -> {
	            StartInstancesRequest request = new StartInstancesRequest()
	                .withInstanceIds(instance_id);

	            return request.getDryRunRequest();
	        };

	        DryRunResult dry_response = ec2.dryRun(dry_request);

	        if(!dry_response.isSuccessful()) {
	            System.out.printf(
	                "Failed dry run to start instance %s", instance_id);

	            throw dry_response.getDryRunResponse();
	        }

	        StartInstancesRequest request = new StartInstancesRequest()
	            .withInstanceIds(instance_id);
	        
	        ec2.startInstances(request);

	        
	        
	     //   final AmazonEC2 ec2 = AmazonEC2ClientBuilder.defaultClient();
	        boolean done = false;
	        while(!done) {
	        	Thread.sleep(1000);
	        	String status = getInstanceStatus(ec2, instance_id);
	        	if(status != null && "running".equals(status)) {
	        		done = true;
	        	}
	        }
	        
	        System.out.printf("\nSuccessfully started instance %s", instance_id);
	    }
	 
	  public static String getStatus(String instance_id) {
			 AWSCredentialsProvider credentialsProvider = new PropertiesFileCredentialsProvider(
		    			"src/main/resources/AwsCredentials.properties");
		        final AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
		        	     .withCredentials(credentialsProvider)
		        	     .withRegion(Regions.AP_SOUTHEAST_1)
		        	     .build();
		  DescribeInstanceStatusRequest describeInstanceRequest = new DescribeInstanceStatusRequest().withInstanceIds(instance_id);
		  DescribeInstanceStatusResult describeInstanceResult = ec2.describeInstanceStatus(describeInstanceRequest);
		  List<InstanceStatus> state = describeInstanceResult.getInstanceStatuses();
		  while (state.size() < 1) { 
		      // Do nothing, just wait, have thread sleep if needed
		      describeInstanceResult = ec2.describeInstanceStatus(describeInstanceRequest);
		      state = describeInstanceResult.getInstanceStatuses();
		  }
		  String status = state.get(0).getInstanceState().getName();
		  System.out.println(status);
		  return status;
	  }

	    public static void stopInstance(String instance_id) throws InterruptedException
	    {
	    	AWSCredentialsProvider credentialsProvider = new PropertiesFileCredentialsProvider(
	    			"src/main/resources/AwsCredentials.properties");
	        final AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
	        	     .withCredentials(credentialsProvider)
	        	     .withRegion(Regions.AP_SOUTHEAST_1)
	        	     .build();
	        String currentStatus = getInstanceStatus(ec2, instance_id);
        	if(currentStatus != null && "stopped".equals(currentStatus)) {
        		System.out.println("\nAlready Stopped");
        		return;
        	}
	        //AmazonEC2ClientBuilder.defaultClient();

	        DryRunSupportedRequest<StopInstancesRequest> dry_request =
	            () -> {
	            StopInstancesRequest request = new StopInstancesRequest()
	                .withInstanceIds(instance_id);

	            return request.getDryRunRequest();
	        };

	        DryRunResult dry_response = ec2.dryRun(dry_request);

	        if(!dry_response.isSuccessful()) {
	            System.out.printf(
	                "Failed dry run to stop instance %s", instance_id);
	            throw dry_response.getDryRunResponse();
	        }

	        StopInstancesRequest request = new StopInstancesRequest()
	            .withInstanceIds(instance_id);

	        ec2.stopInstances(request);
	        boolean done = false;
	        while(!done) {
	        	Thread.sleep(1000);
	        	String status = getInstanceStatus(ec2, instance_id);
	        	if(status != null && "stopped".equals(status)) {
	        		done = true;
	        	}
	        }
	        System.out.printf("\nSuccessfully stop instance %s", instance_id);
	    }
	    
	    public static String getInstanceStatus(AmazonEC2 ec2, String instance_id) {
	    	String status = null;
	    	
	    	 DescribeInstancesRequest request1 = new DescribeInstancesRequest().withInstanceIds(instance_id);
		        //while(!done) {
		            DescribeInstancesResult response = ec2.describeInstances(request1);

		            for(Reservation reservation : response.getReservations()) {
		                for(Instance instance : reservation.getInstances()) {
		                    System.out.printf(
		                        "\nFound instance with id %s, " +
		                        "AMI %s, " +
		                        "type %s, " +
		                        "state %s " +
		                        "and monitoring state %s",
		                        instance.getInstanceId(),
		                        instance.getImageId(),
		                        instance.getInstanceType(),
		                        instance.getState().getName(),
		                        instance.getMonitoring().getState());
		                    status = instance.getState().getName();
		                    
		                }
		            }
		            return status;
	    }
	    
	    public static List<Instance> getAllInstances(){
	    	AWSCredentialsProvider credentialsProvider = new PropertiesFileCredentialsProvider(
	    			"src/main/resources/AwsCredentials.properties");
	        final AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
	        	     .withCredentials(credentialsProvider)
	        	     .withRegion(Regions.AP_SOUTHEAST_1)
	        	     .build();
	       return getAllInstances(ec2); 
	    }
	    
	    public static List<Instance> getAllInstances(AmazonEC2 ec2) {
	    	String status = null;
	    	List<Instance> instances = new ArrayList<Instance>();
	    	 DescribeInstancesRequest request1 = new DescribeInstancesRequest();
		    //    while(!done) {
		            DescribeInstancesResult response = ec2.describeInstances(request1);

		            for(Reservation reservation : response.getReservations()) {
		            	instances.addAll(reservation.getInstances());
		                /*for(Instance instance : reservation.getInstances()) {
		                    System.out.printf(
		                        "\nFound instance with id %s, " +
		                        "AMI %s, " +
		                        "type %s, " +
		                        "state %s " +
		                        "and monitoring state %s",
		                        instance.getInstanceId(),
		                        instance.getImageId(),
		                        instance.getInstanceType(),
		                        instance.getState().getName(),
		                        instance.getMonitoring().getState());
		                    status = instance.getState().getName();
		                    break;
		                }*/
		            }
		            return instances;
	    }
	    
	    public static void rebootInstance(String instance_id) throws InterruptedException
	    {
	    	stopInstance(instance_id);
	    	startInstance(instance_id);
	    	/*AWSCredentialsProvider credentialsProvider = new PropertiesFileCredentialsProvider(
	    			"resources/AwsCredentials.properties");
	        final AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
	        	     .withCredentials(credentialsProvider)
	        	     .withRegion(Regions.AP_SOUTHEAST_1)
	        	     .build();
	        
	        //AmazonEC2ClientBuilder.defaultClient();

	        DryRunSupportedRequest<RebootInstancesRequest> dry_request =
	            () -> {
	            	RebootInstancesRequest  request = new RebootInstancesRequest()
	                .withInstanceIds(instance_id);

	            return request.getDryRunRequest();
	        };

	        DryRunResult dry_response = ec2.dryRun(dry_request);

	        if(!dry_response.isSuccessful()) {
	            System.out.printf(
	                "Failed dry run to reboot instance %s", instance_id);
	            throw dry_response.getDryRunResponse();
	        }

	        RebootInstancesRequest request = new RebootInstancesRequest()
	            .withInstanceIds(instance_id);

	        RebootInstancesResult response = ec2.rebootInstances(request);
	        System.out.println(response);
	        
	        boolean done = false;
	        while(!done) {
	        	Thread.sleep(2000);
	        	String status = getInstanceStatus(ec2, instance_id);
	        	if(status != null && "running".equals(status)) {
	        		done = true;
	        	}
	        }

	      //  System.out.printf("Successfully reboot instance %s", instance_id);
*/	    }   


	    public static void main(String[] args) throws FileNotFoundException, IOException
	    {
	        final String USAGE =
	            "To run this example, supply an instance id and start or stop\n" +
	            "Ex: StartStopInstance <instance-id> <start|stop>\n";
             System.out.println(args[1]);
	        if (args.length < 2) {
	            System.out.println(USAGE);
	            System.exit(1);
	        }
	        Properties properties=new Properties();
	        properties.load(new FileInputStream("src/main/resources/AwsCredentials.properties"));
	     //   String awsAccessKey=properties.getProperty("aws.instance-id");
	        String instance_id = properties.getProperty("aws.instance-id");

	        boolean start;

	        if(args[1].equals("start")) {
	            start = true;
	        } else {
	            start = false;
	        }

	        if(args[1].equals("start")) {
	            try {
					startInstance(instance_id);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}	           
	        }else if(args[1].equals("reboot")){
	        	try {
					//rebootInstance(instance_id);
	        		stopInstance(instance_id);
	        		startInstance(instance_id);
	        		
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	        }else {	        
	            try {
					stopInstance(instance_id);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	        }
	        //getStatus(instance_id);
	    }
}


