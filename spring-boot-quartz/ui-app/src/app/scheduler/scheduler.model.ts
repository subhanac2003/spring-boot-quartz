export class Job {
    id: number
    name: string;
    startDate: string;
}

export class Holidays {
    staticDataTimeZone: any =
        {
            "JST": [
                {
                    "title": "New Year's Day",
                    "date": "2019-01-01",
                },
                {
                    "title": "January 2 Bank Holiday",
                    "date": "2019-01-02"
                },
                {
                    "title": "January 3 Bank Holiday",
                    "date": "2019-01-03"
                },
                {
                    "title": "Coming of Age Day",
                    "date": "2019-01-14",
                },
                {
                    "title": "National Foundation Day",
                    "date": "2019-02-11"
                },
                {
                    "title": "Valentine's Day",
                    "date": "2019-02-14"
                },
                {
                    "title": "March Equinox/Spring Equinox",
                    "date": "2019-03-21"
                },
                {
                    "title": "Showa Day",
                    "date": "2019-04-29"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-04-30",
                },
                {
                    "title": "Coonation",
                    "date": "2019-05-01"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-05-02",
                },
                {
                    "title": "Constitution Memorial Day",
                    "date": "2019-05-03"
                },
                {
                    "title": "Children's Day observed",
                    "date": "2019-08-06"
                },
                {
                    "title": "Sea Day",
                    "date": "2019-07-15",
                },
                {
                    "title": "Hiroshima Memorial Day",
                    "date": "2019-08-06"
                },
                {
                    "title": "Nagasaki Memorial Day",
                    "date": "2019-08-09"
                },
                {
                    "title": "Mountain Day observed",
                    "date": "2019-08-12",
                },
                {
                    "title": "Christmas",
                    "date": "2019-12-25"
                },
                {
                    "title": "December 31 Bank Holiday",
                    "date": "2019-12-21"
                }
            ],

            "GMT": [
                {
                    "title": "New Year's Day",
                    "date": "2019-01-01",
                },
                {
                    "title": "January 2 Bank Holiday",
                    "date": "2019-01-02"
                },
                {
                    "title": "January 3 Bank Holiday",
                    "date": "2019-01-03"
                },
                {
                    "title": "Coming of Age Day",
                    "date": "2019-01-14",
                },
                {
                    "title": "National Foundation Day",
                    "date": "2019-02-11"
                },
                {
                    "title": "Valentine's Day",
                    "date": "2019-02-14"
                },
                {
                    "title": "March Equinox/Spring Equinox",
                    "date": "2019-03-21"
                },
                {
                    "title": "Showa Day",
                    "date": "2019-04-29"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-04-30",
                },
                {
                    "title": "Coonation",
                    "date": "2019-05-01"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-05-02",
                },
                {
                    "title": "Constitution Memorial Day",
                    "date": "2019-05-03"
                },
                {
                    "title": "Children's Day observed",
                    "date": "2019-08-06"
                },
                {
                    "title": "Sea Day",
                    "date": "2019-07-15",
                },
                {
                    "title": "Hiroshima Memorial Day",
                    "date": "2019-08-06"
                },
                {
                    "title": "Nagasaki Memorial Day",
                    "date": "2019-08-09"
                },
                {
                    "title": "Mountain Day observed",
                    "date": "2019-08-12",
                },
                {
                    "title": "Christmas",
                    "date": "2019-12-25"
                },
                {
                    "title": "December 31 Bank Holiday",
                    "date": "2019-12-21"
                }
            ],

            "EST": [
                {
                    "title": "New Year's Day",
                    "date": "2019-01-01",
                },
                {
                    "title": "January 2 Bank Holiday",
                    "date": "2019-01-02"
                },
                {
                    "title": "January 3 Bank Holiday",
                    "date": "2019-01-03"
                },
                {
                    "title": "Coming of Age Day",
                    "date": "2019-01-14",
                },
                {
                    "title": "National Foundation Day",
                    "date": "2019-02-11"
                },
                {
                    "title": "Valentine's Day",
                    "date": "2019-02-14"
                },
                {
                    "title": "March Equinox/Spring Equinox",
                    "date": "2019-03-21"
                },
                {
                    "title": "Showa Day",
                    "date": "2019-04-29"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-04-30",
                },
                {
                    "title": "Coonation",
                    "date": "2019-05-01"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-05-02",
                },
                {
                    "title": "Constitution Memorial Day",
                    "date": "2019-05-03"
                },
                {
                    "title": "Children's Day observed",
                    "date": "2019-08-06"
                },
                {
                    "title": "Sea Day",
                    "date": "2019-07-15",
                },
                {
                    "title": "Hiroshima Memorial Day",
                    "date": "2019-08-06"
                },
                {
                    "title": "Nagasaki Memorial Day",
                    "date": "2019-08-09"
                },
                {
                    "title": "Mountain Day observed",
                    "date": "2019-08-12",
                },
                {
                    "title": "Christmas",
                    "date": "2019-12-25"
                },
                {
                    "title": "December 31 Bank Holiday",
                    "date": "2019-12-21"
                }
            ],

            "IST": [
                {
                    "title": "New Year's Day",
                    "date": "2019-01-01",
                },
                {
                    "title": "January 2 Bank Holiday",
                    "date": "2019-01-02"
                },
                {
                    "title": "January 3 Bank Holiday",
                    "date": "2019-01-03"
                },
                {
                    "title": "Coming of Age Day",
                    "date": "2019-01-14",
                },
                {
                    "title": "National Foundation Day",
                    "date": "2019-02-11"
                },
                {
                    "title": "Valentine's Day",
                    "date": "2019-02-14"
                },
                {
                    "title": "March Equinox/Spring Equinox",
                    "date": "2019-03-21"
                },
                {
                    "title": "Showa Day",
                    "date": "2019-04-29"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-04-30",
                },
                {
                    "title": "Coonation",
                    "date": "2019-05-01"
                },
                {
                    "title": "Coronation Day holiday",
                    "date": "2019-05-02",
                },
                {
                    "title": "Constitution Memorial Day",
                    "date": "2019-05-03"
                },
                {
                    "title": "Children's Day observed",
                    "date": "2019-08-06"
                },
                {
                    "title": "Sea Day",
                    "date": "2019-07-15",
                },
                {
                    "title": "Hiroshima Memorial Day",
                    "date": "2019-08-06"
                },
                {
                    "title": "Nagasaki Memorial Day",
                    "date": "2019-08-09"
                },
                {
                    "title": "Mountain Day observed",
                    "date": "2019-08-12",
                },
                {
                    "title": "Christmas",
                    "date": "2019-12-25"
                },
                {
                    "title": "December 31 Bank Holiday",
                    "date": "2019-12-21"
                }
            ]
        }

}