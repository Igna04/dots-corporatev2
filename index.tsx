import { AppRegistry } from 'react-native';
import App from './App'; // Adjust this path if App.tsx is not at the root
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
    