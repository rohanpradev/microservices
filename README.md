

# Microservices

![](https://www.nginx.com/wp-content/uploads/2015/11/Microservices-Cubes-300x300-PMS355.png)


###About

> This is a microservices based project which handles tickets. The tech stack includes  
node js, mongoDB, NATS streaming server, redis and Next js.  


###Installation
You need to have docker and kubernetes in your system to run this project.

Make sure to install node modules in all subdirectories using

`$ npm install`

Install [skaffold](https://skaffold.dev) and add it to tyour PATH variables.

In the main folder make sure to run  

`$ skaffold dev`

Check [localhost:3000](http://localhost:3000) to see the magic appear.

###End
