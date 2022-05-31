# Clear Lake Data Visualization and Monitoring React App

![Screen Shot 2022-05-30 at 6 48 48 PM](https://user-images.githubusercontent.com/45191572/171077195-d74f9c90-645d-4c18-bc26-cc7953652e77.png)


## Background 

The UC Davis Tahoe Environmental Research Center (TERC) team currently owns a non-official UC Davis Wix website to share their blogs, data, data visualization, and publications. This brings several concerns, one being the static use of data in the current data visualization of their website. Additionally, the big danger in this static data is the location in which the data is currently stored, which is a former web developer’s personal Github repository and being called for in the data visualizations. This brings instability and insecurity, as the data is controlled and managed by a single former employee.

Moreover, the TERC team is looking to have more interactive and dynamic data visualizations, allowing lake users and stakeholders to view specific time windows of data, generate CSV files to their local computer, and filter different lake and stream variables within a specific data chart. We are innovating this problem to create more visually appealing and user-friendly data visualizations. We plan to increase the user journey and experience through this new site, which will encourage more lake holders and stakeholders to be part of the research and the findings of the TERC team.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Main Features

**Dynamic and interactive data visualizations for Streams, Meteorology, Lake Profile, and Lake Mooring**
- Allow users to query graphs on different variables and time intervals
- Allows zooming features, tooltips for data point information, variable toggling to view trends between different variables
- Frequently Asked Questions for any user concerns, such as the link to metadata and how to use the graphs
- Download data displayed in charts in various formats
- Date pickers for users to select desired time frames.
- Click on the name of the series in the legend to toggle graph lines.

**Map of the Clear Lake Watershed Boundary and data collection locations**

**Provide a weather widget to show current and forecasted weather at Clear Lake**
- Includes a brief description of the weather, wind, and humidity, and icons to illustrate the weather

**Downloadable CSV feature for users to download clean and real-time data**
- Allows users to query different variables and time frames to download
- Allows other downloadable types, such as an image of the chart in PNG, JPEG, PDF, SVG forms

**Uploadable CSV feature for client to upload clean data**
- Connect any uploaded data to MySQL with the data visualization graphs and automatically update them

**Easy to manage the site for clients to update blogs, news, photos, and more**
- Used SiteFarm as it is easy to learn to use and has many training videos and UC Davis SiteFarm managers for more complex guidance
- Link to the Main Clear Lake site is https://clearlakerehabilitation.ucdavis.edu/

## Packages Used:



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run deploy`

Deploys new changes made on the main branch onto the hosted website using GitHub Pages
The hosted site is [https://tercdev.github.io/Clear_Lake_Website_Data_Visualization/](https://tercdev.github.io/Clear_Lake_Website_Data_Visualization/)

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
