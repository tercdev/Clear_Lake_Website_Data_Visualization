# Clear Lake Website Data Visualization

**Clean Data**

- CTD
- Meteorological Data
- Stream
- Tchain
    - lake temperature and dissolved oxygen time series at multiple depths from only one location in the lake (UA-06)
    - cleaned, merged, and exported all data between spring 2019 and Fall 2021
    - Data from the other 5 sites will come soon



**Data Visualization Code**

- stream_monitoring:
    - updated data visualization for the stream data
    - contains stream monitoring for three primary lake tributaries: Kelsey, Middle and Scotts Creek
    - currently includes the Turbity and Temperature graphs with adjusting time windows and creek toggling
        - currently using endpoints to fetch data for specific user time window input
        - when page first loads, charts will show data of the last week
        - implemented UI for the form input sections
    - TO DO:
        - clean unexpected data points
        - convert scripts to Python for flow web scraping
        - currently allows csv downloads of all data => fix to allow downloads of specific time windows of data




