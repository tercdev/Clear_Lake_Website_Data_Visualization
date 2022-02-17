%%% UCD_stream_turb_clean %%%

% This code conduct the following process:
%   - visulize raw stream flow and turbitiy data
%   - remove bad data and visualize clean data

% INPUTS
% 1 -  Raw 2018-22 UCD CL stream turbidity .dat files (Scotts, Middle and Kelsy)
%     loc: Box/Clear_Lake/Streams/1_Data/1_Raw/2_UCDavis/Turbidity_Temperature/raw_data
% 2 - User  Raw 2018-20 DWR Flow data that downloaded from CEDEN
%     loc: \Box\Clear_Lake\Streams\Data\DWR\raw_data

% OUTPUTS
% 1 - streams.mat file - Contains raw turb (Turb) and flow (Flow)  time synced data for flow and turbidity
% at each stream in .syncdata structure

% Notes
% 1 - Data has all been converted to UTC
% 2 - The following cleaning procedures were conducted
%       a) all turb values < 1600 set 1600 (max sensor reading)
%       b) for periods of NaN values < 1 hour, linearly interpolated
%       between turb values before and after data gap


% Versions
% v 2.0 - changed DWR input to raw csv files

% v1 - written December 2021
% v2 - added in data scraping from CEDEN for dwr

%% visualuzes a timeseries of stream turbidity (UCD) and flow data (DWR) for Scotts, Middle and Kelsey Creek


clear all; close all; clc
tic

%% Load in Turbidity Data download for NS Labtop
cd('/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/1_Raw/2_UCDavis/Turbidity_Temperature/raw_data')
list = dir;

c = 1;
for i = 1:length(list)
    if contains(list(i).name,'.dat')
        fname = list(i).name;
    dum = split(fname,'CL ');
    dum = dum{2};
    dum = split(dum,'Creek');
    site = dum{1};
%% Set up the Import Options and import the data
opts = delimitedTextImportOptions("NumVariables", 9);
opts.DataLines = [5, Inf];
opts.Delimiter = ",";
opts.VariableNames = ["TIMESTAMP", "RECORD", "Turb_BES", "Turb_Mean", "Turb_Median", "Turb_Var", "Turb_Min", "Turb_Max", "Turb_Temp"];
opts.VariableTypes = ["datetime", "double", "double", "double", "double", "double", "double", "double", "double"];
opts.ExtraColumnsRule = "ignore";
opts.EmptyLineRule = "read";
opts = setvaropts(opts, "TIMESTAMP", "InputFormat", "yyyy-MM-dd HH:mm:ss");

% Import the data
tbl = readtable(['/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/1_Raw/2_UCDavis/Turbidity_Temperature/raw_data/',fname], opts);

% Convert to output type
Turb_raw(c).site = site;
Turb_raw(c).date = tbl.TIMESTAMP; %Turb(c).date.TimeZone = 'UTC';
Turb_raw(c).record = tbl.RECORD;
Turb_raw(c).turb_bes = tbl.Turb_BES;
Turb_raw(c).turb_mean = tbl.Turb_Mean;
Turb_raw(c).turb_median = tbl.Turb_Median;
Turb_raw(c).turb_var = tbl.Turb_Var;
Turb_raw(c).turb_min = tbl.Turb_Min;
Turb_raw(c).turb_max = tbl.Turb_Max;
Turb_raw(c).turb_temp = tbl.Turb_Temp;

c = c+1;
% Clear temporary variables
clear opts tbl
    end
end

%% Load in Stream Data
cd('/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/2_Matfiles/1_DWR');
list = dir;

for i = 1:length(list)
    if(contains(list(i).name,'DWR_CL_stream'));
        fname = list(i).name;
    end
end
load(fname)

%% Plotting Raw Data
figure('name','Raw Data','position',[82 215 1260 625])
for i =1:3
    ax(i) = subplot(3,1,i);
    yyaxis left
    plot(stream(i).date,stream(i).flow,'LineWidth',1.5); hold on
    ylim([0 3000]);
    ylabel('Flow [cfs]');
    
    yyaxis right
    plot(Turb_raw(i).date,Turb_raw(i).turb_bes,'r.','LineWidth',1.5); hold on
    title(Turb_raw(i).site);
    set(gca,'FontSize',14);
    
    ylabel('Turb [NTU]');
end
linkaxes(ax,'xy');
ylim([0 1000])
xlim([datetime(2018,12,01) datetime(today,'ConvertFrom','datenum')]);
toc

%% Cleaning Data
Turb_clean = Turb_raw;

% set all values >1600 NTU = NTU (Max sensor range)
for i = 1:3
    ix = find(Turb_clean(i).turb_bes>1600);
    Turb_clean(i).turb_bes(ix)=1600;
end
% Kelsey Creek
i = 1; % index for Kelsey Creek

% clogged sensor
t1 = datetime(2019,02,26,02,30,00);
t2 = datetime(2019,03,04,23,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2019,06,01,00,00,00);
t2 = datetime(2019,06,22,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2021,01,12,00,00,00);
t2 = datetime(2021,01,26,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% remove nans for short period in may 2021 when sensor was briefly turned
% on
t1 = datetime(2021,04,12,00,00,00);
t2 = datetime(2021,07,26,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2021,11,01,00,00,00);
t2 = datetime(2021,12,13,16,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% Middle Creek
i = 2; % index for Middle Creek

% high values during low flow
t1 = datetime(2019,06,04,00,00,00);
t2 = datetime(2019,07,17,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2020,06,04,00,00,00);
t2 = datetime(2020,03,04,22,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2020,04,08,23,30,00);
t2 = datetime(2020,05,17,04,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2020,05,19,15,00,00);
t2 = datetime(2020,07,17,04,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2020,0095,19,15,00,00);
t2 = datetime(2021,01,27,20,45,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% high values during low flow
t1 = datetime(2021,03,19,20,50,00);
t2 = datetime(2021,08,27,20,45,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2021,12,26,02,40,00);
t2 = datetime(2022,01,12,06,40,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

t1 = datetime(2022,01,18,00,00,00);
t2 = datetime(2022,02,14,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>10);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% Scotts Creek
i = 3; % index for Scotts Creek

% clogged sensor
t1 = datetime(2019,01,18,05,40,00);
t2 = datetime(2019,02,09,00,30,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2019,03,23,16,30,00);
t2 = datetime(2019,03,25,08,50,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2019,03,31,09,30,00);
t2 = datetime(2019,04,04,02,10,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% sunglight interfereence
t1 = datetime(2019,05,07,50,00,00);
t2 = datetime(2019,07,14,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;


% clogged sensor
t1 = datetime(2019,11,26,21,00,00);
t2 = datetime(2019,11,27,12,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2019,11,30,18,30,00);
t2 = datetime(2019,12,04,22,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2019,12,28,05,12,00);
t2 = datetime(2019,12,28,14,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2019,12,29,19,50,00);
t2 = datetime(2019,12,30,01,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% removing all values above 5 NTu when flow was less than 20 in jan 2020
t1 = datetime(2019,12,29,19,50,00);
t2 = datetime(2020,01,09,01,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>5);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% clogged sensor
t1 = datetime(2020,01,17,14,20,00);
t2 = datetime(2020,01,20,01,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2020,02,05,06,00,00);
t2 = datetime(2020,02,06,06,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% removing all values above 5 NTu when flow was less than 20 in jan 2020
t1 = datetime(2020,01,11,00,00,00);
t2 = datetime(2020,01,14,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>5);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% clogged sensor
t1 = datetime(2020,05,20,06,00,00);
t2 = datetime(2020,06,20,05,50,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% sensor looks to be dry removing any values above 1 NTU0 from 2/7/20 - 3/14/20
t1 = datetime(2020,02,07,00,00,00);
t2 = datetime(2020,03,14,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

t1 = datetime(2020,05,15,00,00,00);
t2 = datetime(2020,05,18,06,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 -
% 4/4/20
t1 = datetime(2020,03,13,00,00,00);
t2 = datetime(2020,04,04,18,10,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 -
% 4/4/20
t1 = datetime(2020,04,08,00,00,00);
t2 = datetime(2020,05,11,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% sensor looks to be dry removing any values above 1 NTU0 from 3/19/20 -
% 4/4/20
t1 = datetime(2020,12,01,00,00,00);
t2 = datetime(2021,08,01,21,15,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% sensor looks to be dry removing any values above 1 NTU

t1 = datetime(2021,03,06,00,00,00);
t2 = datetime(2021,03,10,05,20,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;

% clogged sensor
t1 = datetime(2021,04,25,17,50,00);
t2 = datetime(2021,04,25,19,40,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;


% clogged sensor
t1 = datetime(2020,05,18,16,40,00);
t2 = datetime(2020,05,19,05,40,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2021,05,15,22,10,00);
t2 = datetime(2021,05,15,22,30,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
Turb_clean(i).turb_bes(ix) = NaN;

% clogged sensor
t1 = datetime(2021,06,14,12,10,00);
ix = find(Turb_clean(i).date==t1);
Turb_clean(i).turb_bes(ix) = NaN;

t1 = datetime(2022,01,04,00,00,00);
t2 = datetime(2022,05,11,00,00,00);
ix = find(Turb_clean(i).date>=t1 & Turb_clean(i).date<=t2);
ix2 = find(Turb_clean(i).turb_bes>1);
ix3 = intersect(ix2,ix);
Turb_clean(i).turb_bes(ix3) = NaN;
%% Plotting Clean Data
figure('name','Clean Data','position',[82 215 1260 625])
for i =1:3
    ax(i) = subplot(3,1,i);
    yyaxis left
    plot(stream(i).date,stream(i).flow,'LineWidth',1.5); hold on
    ylim([0 3000]);
    ylabel('Flow [cfs]');
    
    yyaxis right
    plot(Turb_clean(i).date,Turb_clean(i).turb_bes,'r.','LineWidth',1.5); hold on
    title(Turb_clean(i).site);
    set(gca,'FontSize',14);
    
    ylabel('Turb [NTU]');
end
linkaxes(ax,'xy');
ylim([0 1600])
xlim([datetime(2018,12,01) datetime(today,'ConvertFrom','datenum')]);
toc

%% write to csv
cd('/Users/micahswann/Library/CloudStorage/Box-Box/Clear_Lake/Streams/1_Data/3_Clean_CSV');

stream_name = ['Kelsey';'Middle';'Scotts'];
for i = 1:3
    date = Turb_clean(i).date;
    turb = Turb_clean(i).turb_bes;
    temp = Turb_clean(i).turb_temp;
    final = table(date,turb,temp);
    writetable(final,[stream_name(i,:),'_turb_clean.csv']);
end
