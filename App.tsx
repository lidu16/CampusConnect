import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';

// Import our Firebase initialization so it runs exactly once
import './src/services/firebase'; 

export default function App() {
  return <RootNavigator />;
}