package com.aws.rds;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.rds.AmazonRDS;
import com.amazonaws.services.rds.AmazonRDSClient;
import com.amazonaws.services.rds.AmazonRDSClientBuilder;
import com.amazonaws.services.rds.model.DBInstance;
import com.amazonaws.services.rds.model.DescribeDBInstancesResult;
import com.amazonaws.services.rds.model.Endpoint;
import com.amazonaws.services.rds.model.StartDBInstanceRequest;
import com.amazonaws.services.rds.model.StopDBInstanceRequest;

public class StartStopRdsInstance {
	
	static Properties props = new Properties();
	
	static{
		String resourceName = "AwsCredentials.properties"; // could also be a constant
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		//Properties props = new Properties();
		try(InputStream resourceStream = loader.getResourceAsStream(resourceName)) {
		    props.load(resourceStream);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private static AmazonRDS getRDS() {
		AWSCredentials credentials = new BasicAWSCredentials(props.getProperty("accessKey"), props.getProperty("secretKey"));
		AWSCredentialsProvider credentialsProvider = new AWSStaticCredentialsProvider(credentials);
		AmazonRDS rds = AmazonRDSClientBuilder.standard().withCredentials(credentialsProvider)
								                 .withRegion(Regions.AP_SOUTHEAST_1)
								                 .build();
		return rds;
	}

	public static List<DBInstance> getAllInstances() {	
		AmazonRDS rds = getRDS();
		DescribeDBInstancesResult result = rds.describeDBInstances();
		List<DBInstance> instances = result.getDBInstances();		
		return instances == null ? new ArrayList<DBInstance>():instances;
	 }
	
	public static String getRdsInstanceStatus(AmazonRDS rds, String dbInstanceIdentifier) {
		String status = null;						
		DescribeDBInstancesResult result = rds.describeDBInstances();
		List<DBInstance> instances = result.getDBInstances();
		System.out.println(instances);
		for (DBInstance instance : instances) {
		    // Information about each RDS instance
			if(dbInstanceIdentifier.equalsIgnoreCase(instance.getDBInstanceIdentifier())){
				System.out.println("DB Instance Status :: "+instance.getDBInstanceStatus());
				status = instance.getDBInstanceStatus();
				break;
			}
		    /*String identifier = instance.getDBInstanceIdentifier();
		    String engine = instance.getEngine();
		    String status = instance.getDBInstanceStatus();
		    Endpoint endpoint = instance.getEndpoint();*/
		    
		  
		  
		  
		    //System.out.println(instance);
		}
		/*StopDBInstanceRequest stopRequest = new StopDBInstanceRequest()
                .withDBInstanceIdentifier("mymssqldbinstance");
rds.stopDBInstance(stopRequest);*/
		return status;
	}
		
	 
  public static void startDBInstance(String dbInstanceIdentifier) throws InterruptedException {
		  
		  AmazonRDS rds = getRDS();
		  String currentStatus = getRdsInstanceStatus(rds, dbInstanceIdentifier);
      	  if(currentStatus != null && "available".equalsIgnoreCase(currentStatus)) {
      		System.out.println("\nAlready Running");
      		return;
      	  }
		  StartDBInstanceRequest startRequest = new StartDBInstanceRequest()
	                .withDBInstanceIdentifier(dbInstanceIdentifier);
	       rds.startDBInstance(startRequest);
	       
	       boolean done = false;
	        while(!done) {
	        	Thread.sleep(5000);
	        	String status = getRdsInstanceStatus(rds, dbInstanceIdentifier);
	        	if(status != null && "available".equalsIgnoreCase(status)) {
	        		done = true;
	        	}
	        }
		  
	       System.out.printf("\nSuccessfully started instance %s", dbInstanceIdentifier);
	  }
  
	  public static void stopDBInstance(String dbInstanceIdentifier) throws InterruptedException {
		  
		  AmazonRDS rds = getRDS();
		  String currentStatus = getRdsInstanceStatus(rds, dbInstanceIdentifier);
      	  if(currentStatus != null && "stopped".equals(currentStatus)) {
      		System.out.println("\nAlready Stopped");
      		return;
      	  }
		  StopDBInstanceRequest stopRequest = new StopDBInstanceRequest()
	                .withDBInstanceIdentifier(dbInstanceIdentifier);
	       rds.stopDBInstance(stopRequest);
	       
	       boolean done = false;
	        while(!done) {
	        	Thread.sleep(5000);
	        	String status = getRdsInstanceStatus(rds, dbInstanceIdentifier);
	        	if(status != null && "stopped".equals(status)) {
	        		done = true;
	        	}
	        }
		  
	       System.out.printf("\nSuccessfully stopped instance %s", dbInstanceIdentifier);
	  }
	  
	  public static void rebootDBInstance(String dbInstanceIdentifier) throws InterruptedException {
	  
		  stopDBInstance(dbInstanceIdentifier);
		  startDBInstance(dbInstanceIdentifier);
	  }
		
		public static void main(String[] args) throws InterruptedException {
			System.out.println(getAllInstances());
			//stopDBInstance("mymssqldbinstance");
		}
		
		
	
}
