%%% DWR_CL_stream_Data_Scraper

% pulls stream flow data from CEDEN for 3 clear
% lake tributaries (Kelsey, SCotts and Middle
% Creek

% Notes - Date fetched from 10/01/2018 - today

clear all; close all; clc
tic

% find last .mat file
cd('/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/2_Matfiles/1_DWR')
list = dir;
for i =1:length(list)
   if(contains(list(i).name,'DWR_CL_stream'))
       fname = list(i).name;
   end
    
end
load(fname);
dum = stream(1).date(end);

%%

SID = {'KCK','SCS','MCU'}; % site IDs on Ceden
tday = datetime(today,'ConvertFrom','datenum'); % todays date
tday = tday-1; % look at data through yesterday

a = round(day(tday-dum));

%day1 = datetime(2018,10,01); % start date of 2018-19 WY
%a = tday-day1; 
a = days(a); a = a+1;
a = char(string(a));
tday = char(string(tday));

% set timeout to infinity 
% to load
options = weboptions;
options.Timeout = inf;
for i = 1:3
dum = SID{i};
url = (['http://cdec.water.ca.gov/dynamicapp/QueryF?s=',dum,'&d=',tday,'+23:00&span=',a,'days']);
data = webread(url,options); % read in data as .html file
tree = htmlTree(data); % create tree
str = extractHTMLText(tree); % extract TEXT from html file
str2 = splitlines(str); % split string at line returns
blnk = str2(2,1);
ix = find(strcmp(str2,blnk)==0); 
str3  = str2(ix);
start = find(contains(str3,'CFS')); start = start(end)+1; % find starting index
stop = find(contains(str3,'Later')); stop = stop(end)-1; % find ending index
str4 = str3(start:stop);
str5 = split(str4);
l2 = length(str5);

date  = datetime(str5(:,1),'InputFormat','MM/dd/yyyy','Format','dd.MM.uuuu HH:mm');
time = datetime(str5(:,2),'InputFormat','HH:mm','Format','dd.MM.uuuu HH:mm');
dt = date + timeofday(time);
stage = double(str5(:,3));
flow = double(str5(:,4));

% format into data structure
l = length(stream(i).date);
l2 = length(dt);
%stream(i).site(l+1:l+l2) = SID{i};
stream(i).date(l+1:l+l2) = dt;
stream(i).stage(l+1:l+l2) = stage;
stream(i).flow(l+1:l+l2) = flow;
toc
end


% saving

cd('/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/2_Matfiles/1_DWR')

tday = datetime(today,'ConvertFrom','datenum','Format','yyyyMMdd'); % todays date
tday = char(string(tday));

filename = ['DWR_CL_stream_flows_',tday];

save(filename,'stream');