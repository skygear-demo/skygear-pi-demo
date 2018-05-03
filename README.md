# 🚦 Skygear on Raspberry Pi Quick Example

This demo is based on NodeJS, which is suggested for real time applications. For other IoT applications, you may just want to use HTTP endpoints to connect to your devices.

### Prerequisite
* Raspbian GNU/Linux 9 (stretch) [Download](https://www.raspberrypi.org/downloads/raspbian/)
* NodeJS
* [NPM](https://www.npmjs.com/get-npm)


### Demo flow
1. Clone or download this project to Skygear
2. Run `npm install` to install libraries required 
3. (Optional) Update the endpoint and API Key at `/index.js`

```
const endPoint = process.env.SKYGEAR_ENDPOINT? process.env.SKYGEAR_ENDPOINT : "https://iotsample.skygeario.com/"; // update here
const apiKey = process.env.SKYGEAR_APIKEY? process.env.SKYGEAR_APIKEY : "fe8bc005f8cb4f8b92b187dee6e96f6f"; // update here 
```

4. This demo also have a cloud code at Skygear [(Source)](https://github.com/david90/skygear-iot-js-cloudcode) to view / send input to the device, please view it at [https://iotsample.skygeario.com/static/index.html](https://iotsample.skygeario.com/static/index.html)

5. Run `npm run start`
6. The device will do the followings:
  * Register as an client at Skygear (you will be given a user ID)
  * Send out a `ping` message, so the panel will receive the signal that the device is alive
  * listen to all other `ping` events, and reply a `reply` when it's alive.
  * if you press `p` on your keyboard, you will send a `ping` from your device.
  * listen to all other `report-saved` events, and display the report content. (A new testing report can be saved via the web panel)

### Skygear portal and CMS

* You may login to [Skygear portal](https://portal.skygear.io) to see the app
* View [CMS](https://iotsample.skygeario.com/cms/)


### Detail

```
+--------------+                ping                       +-------------------------+
|  Cloud Code  +------------------------------------------>+                         |
+--------------+                                           |                         |
                                                           |          Pi Client      |
+--------------+                ping                       |                         |
|  Web Panel   +------------------------------------------>+                         |
+------+-------+                                           +-----------+-------------+
       ^                                                               |
       |                                                               |
       |                                                               |
       +---------------------------------------------------------------+
                              reply (only on received a ping)
```

* `ping` channel:

  * We publish an event to the `ping` channel whenever we initiate a ping. There are three ways toping the user: 1) Cron Job at Cloud Code, 2) the ping button on the web panel, 3) Visit endpoint at https://iotsample.skygeario.com/ping-devices , which will run a `ping` to all devices.
  * Both web panel and Pi device will subscribe to the ping channel after login.


* `reply` channel:

  * When the devices received an event ping, it will publish an event in the `reply` channel. So that the web panel will receive a status update from the device.
  * Note that: the devices will only passively send an update to the `reply` channel. (Of course you can implement your custom logic to make sure the device reports actively)
  * The reply data includes to followings:
  device: the current user id as device id now
  * platform: web / android / pi
  * lastReply: the current time string at the moment of the reply
  
* Report afterSave notification:

  * We have implemented a cloud function, which handles the **Report** record afterSave. After a Report record is saved, we will push an event to the `report-saved `channel.
  * The web panel has subscribed to the r`eport-saved` channel, hence you will receive a notification when someone sends a data to the server.
The major difference between this notification and pinging devices is, the Report record has been saved to the cloud database while ping events are volatile. You can fetch back the corresponding Report data later on.


### Other related projects

- This ping and reply demo also works with an Android app [(source)](https://github.com/david90/skygear-android-iot-sample)
