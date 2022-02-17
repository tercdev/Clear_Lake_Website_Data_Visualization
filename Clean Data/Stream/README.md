# Stream Data Explanation on "for Dev Team.zip"

Hi Dev team,

I've attached a zip file containing raw and clean stream turbidity/temp data as well as two matlab scripts that I used for processing. I hope this will help get you started on producing visualizations for the website.
Stream Turbidity/Temperature data
- 1_Raw - raw .dat files that are stored on the TERC database. This is what you would get from Dean's API endpoints for the stream.
- 2_Clean - cleaned .csv files containing turbidity and temperature from the Clear Lake streams. Please use these files for testing out visualizations
- 3_Matlab - UCD_stream_turb_clean.m - Matlab script used for cleaning the raw turbidity data. If you want to run this script you'll have to update the paths for your computer.
- readme - description of data
Stream Flow data
Visualizing the stream flow data alongside the turbidity data is critical for the data to make sense. I'd like you to try and make a real-time visualization of the stream data collected by the California Department of Water Resources hosted online at the California Data Exchange Center (CDEC). I've included a script that I wrote for scraping the stream flow data from the web (DWR_CL_Stream_Flow_Data_Scraper.m).
Here are the websites where the stream flow data can be accessed.
http://cdec.water.ca.gov/dynamicapp/QueryF?s=SCS http://cdec.water.ca.gov/dynamicapp/QueryF?s=MCU http://cdec.water.ca.gov/dynamicapp/QueryF?s=KCK
This is also a good example of a dynamic display of stream flow data for Middle Creek. Unfortunately we haven't had much rain recently so the plots aren't particularly interesting. https://www.cnrfc.noaa.gov/graphicalRVF.php?id=MUPC1

Let me know if you have ANY questions about the data!

Best, Micah