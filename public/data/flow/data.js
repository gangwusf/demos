export default {
    "graph": [
      {
        "input": "New Case Opened",
        "output": "Owner Changed",
        "time": 10800,
        "frequency": 345,
        "analytics": {
          "cloudAverageTime": 300,
          "cloudAverageFrequency": 250,
          "delaySeverity": "None",
          "isMostFrequent": true,
          "isMostViewed": true
        }
      },
      {
        "input": "New Case Opened",
         "output": "Status Changed to Working",
         "time": 86400,
         "frequency": 112,
        "analytics": {
          "cloudAverageTime": 600,
          "cloudAverageFrequency": 20,
          "delaySeverity": "None",
          "isMostFrequent": false,
          "isMostViewed": false
          }
      },
      {
        "input": "Owner Changed",
        "output": "Status Changed to Need More Information",
        "time": 7200,
        "frequency": 345,
        "analytics": {
          "cloudAverageTime": 100,
          "cloudAverageFrequency": 2,
          "delaySeverity": "None",
          "isMostFrequent": false,
          "isMostViewed": false
        }
      },
      {
        "input": "Status Changed to Need More Information",
        "output": "Status Changed to Closed",
        "time": 10800,
        "frequency": 345,
        "analytics": {
          "cloudAverageTime": 300,
          "cloudAverageFrequency": 200,
          "delaySeverity": "Slight",
          "isMostFrequent": false,
          "isMostViewed": false
        }
      },
      {
        "input": "Status Changed to Closed",
        "output": "end",
        "time": 10800,
        "frequency": 2445,
        "analytics": {
          "cloudAverageTime": 600,
          "cloudAverageFrequency": 20,
          "delaySeverity": "Severe",
          "isMostFrequent": false,
          "isMostViewed": false
        }
      }
    ],
    "allActivities": [
       {
          "id": "New Case Opened", 
          "content": "New Case Opened",
          coordinates: [350, 60],
       },
       {
          "id": "Owner Changed",
          "content": "Owner Changed",
          "frequency": 4,
          "noOfCases": 49728,
          coordinates: [350, 160],
       },
       {
          "id": "Status Changed to Working",
          "content": "Status Changed to Working",
          "frequency": 7,
          "noOfCases": 49728,
          coordinates: [50, 260],
       },
       {
          "id": "Status Changed to Need More Information",
          "content": "Status Changed to Need More Information",
          "frequency": 11,
          "noOfCases": 12754,
          coordinates: [350, 360],
       },
       {
          "id": "Status Changed to Solution Provided",
          "content": "Status Changed to Solution Provided",
          "frequency": 4,
          "noOfCases": 1572,
          coordinates: [350, 460],
       },
       {
          "id": "Status Changed to Closed",
          "content": "Status Changed to Closed",
         "frequency": 5,
         "noOfCases": 29868,
          coordinates: [350, 560],
       },
       {
          "id": "end",
          "content": "end",
          coordinates: [350, 660],
       }
    ],
    variants: {'Variant 1': 27, 'Variant 2': 23, 'Variant 3': 20, 'Variant 4': 17, 'Variant 5': 13, 'Variant 6': 10, 'Variant 7': 7, 'Variant 8': 6, 'Variant 9': 5, 'Other': 10},
    "avgTimeToClose":{amount: 35, percent:28, color: "green"},
    "avgCSAT": {amount:55.31, percent:4.7, color:'green'},
    "openCases": {amount:4712, percent:28, color:'red'},
    vs:'Last 3 months', 
    teams: ['Northwest', 'Southwest', 'Southeast', 'Northeast', 'Midwest', 'West', 'East', 'Central', 'North', 'South'],
  };