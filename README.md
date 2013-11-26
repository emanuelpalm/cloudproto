# Cloud Prototype

A simple application creating a cloud of colored particles. The particle positions and intensities
are all provided from the JavaScript context in order to create high amounts of traffic between the
WebGL server and client.

The purpose of the prototype is to measure the performance impact of using several mutiplexed VBOs.

### Usage
The application relies on being run on a web server, and will not funciton properly otherwise. This
is due to the library relying on XMLHttpRequests, which usage is blocked by most modern browsers
when browsing locally.

Author: Emanuel Palm
