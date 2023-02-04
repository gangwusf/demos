(function() {
  window.initPlayer = () => {
    window.myFPlayer = fluidPlayer(
      'video-id',
      {
        "layoutControls": {
          "controlBar": {
            "autoHideTimeout": 30000000,
            "animated": true,
            "autoHide": false
          },
          "htmlOnPauseBlock": {
            "html": null,
            "height": null,
            "width": null
          },
          "autoPlay": false,
          "mute": true,
          "allowTheatre": false,
          "playPauseAnimation": false,
          "playbackRateEnabled": false,
          "allowDownload": true,
          "playButtonShowing": true,
          "fillToContainer": true,
          "posterImage": ""
        },
        "vastOptions": {
          "adList": [],
          "adCTAText": false,
          "adCTATextPosition": ""
        }
      }
    );

    window.myFPlayer.on('play', function () {
      console.log('Video is playing');
    });

    window.myFPlayer.on('pause', function () {
      console.log('Video is now paused');
    });

    window.myFPlayer.on('ended', function () {
      console.log('Video is now ended');
    });

    let timeupdateCounter = 0;
    window.myFPlayer.on('timeupdate', function (time) {
      if (timeupdateCounter % 4 === 0) {
        let conf = getConfBySecondsInTrackFrames(time);
        console.log(time + " - confidence: " + conf);
        document.getElementById('rmcr-current-conf').innerText = conf;
      }
      timeupdateCounter++;
    });
  }

  function getConfBySecondsInTrackFrames(time) {
    if(window.selectedTrack) {
      for(let i = 0; i < window.selectedTrack.track.length; i++) {
        let frame_seconds = convertDurationToSeconds(window.selectedTrack.track[i].timestamp) * 1;
        if(Math.abs(frame_seconds - time) < 0.1) {
          return Math.round(window.selectedTrack.track[i].confidence * 100) / 100;
        }
      }
    }

    return 'N/A';
  }

  function convertDurationToSeconds(duration)  {
    let seconds = 0;

    let dArr = duration.split('.');
    duration = dArr[0];

    let timeArr = duration.split(':');
    if(timeArr.length === 2) {
      seconds = 60 * timeArr[0] + timeArr[1] * 1;
    }
    if(timeArr.length === 3) {
      seconds = 3600 * timeArr[0] + 60*timeArr[1] + timeArr[2] * 1;
    }

    return seconds + '.' + dArr[1];
  }

  let videoDom = document.getElementById("video-id");
  if(videoDom !== undefined && videoDom !== null) {
    window.initPlayer();
  }
  else {
    console.log('----- cannot find the video tag');
  }

})();