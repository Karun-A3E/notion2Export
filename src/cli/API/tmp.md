

### Physical Layer  (Layer 1) 

The physical layer is the first layer in the OSI, it is the layer where the bits are transmitted to the network and includes all of the physical and electrical characteristics of the network.

- The layer is responsible for transmitting the bits in accordance to the way the device is connected to the network whether it is : 

Regardless of which method the bits are going to be transmitted over the network, it will always be in the form of ,0, and ,1, . Which represent binary code, that computers use to communicate with one another. ,Hence, regardless of whatever media, the bits are going to be sent over as 1 and 0

1. Copper Wire → ,CAT5, and ,CAT6, 

1. Fiber Optic Cable 

> Transition Modulation, is where, in a media or wire, 1 level represents ,1 bit, and another level represents ,0 bit



How are the cables wired ???

If we are using something like a ,CAT5, or ,CAT6, there is the connector at the end called ,RJ45, , this allows the cable to be connected to the computer or to the switch.

The way the connector is connected depends on the standards used : 

These cables tells use whether the cross-over cable or straight-thru cable

<details><summary>Cross-over cable</summary>


<details><summary>Straight-Thru cable</summary>


> Layer 1 view networks from a physical topology perspective i.e. how the network is connected 

How is communication synchronized ???

Communication can be transmitted ,synchronously, or ,asynchronously, .

<details><summary>Asynchronous Communication</summary>


<details><summary>Synchronous Communication</summary>


How is bandwidth utilized ???

The Bandwidth refers to the speed at which bits are being transferred

In Utilizing Bandwidth, there are 2 ways you can approach it : ,Broadband, and ,Baseband,.

<details><summary>Broadband</summary>


<details><summary>Baseband</summary>


The above are physical 1 devices → wired at least

Beyond Wired Cable, there are wireless as well : 

The below are infrastructure access points  :

> Layer 1 Devices are dumb devices, they basically repeat the incoming data and repeat whatever they receive to the other end.


### Data Link Layer (Layer 2)

1. Switch

1. NIC → Network-Interface Card

In the Data Link layer there are sub-layers and they are ,MAC, and ,LLC,.

In the Data Link Layer, there is something called Flow control, what is it ???

The main functionality of the LLC layer is that it multiplexes the protocols over the MAC layer while sending and de-multiplex the protocols while receiving. This layer controls the flow control.

The error-checking of the data link layer is performed by LLC. It can also track the acknowledgments.

While transmitting data, if LLC detects any frame loss, immediately it sends back to the source to transmit over again. The LLC layer comes above the MAC layer and acts as an interface between the upper layers and the MAC layer.

- Provides connection services and allows acknowledgement of receipt of messages

- Provides basic error control functions


MAC → Media Access Control, is a uniquely assigned address, that is made up of 48bits eg. ,00:00:5e:00:53:af . ,The Address is represented in a hexadecimal format, whereby each decimal is 4bit and the first half or 6 of the hexadecimals represent the vendor address and the remaining represent the unique machine address.

The MAC address is like the ,name, of the receiver or the ,home address, of the receiver, there must be a unique MAC addresses on a network, if not the network will fail. Since, the purpose of the MAC address is a set of a Unique identification for devices.

The NIC is responsible for allowing the device it is to, connect to the network. The NIC also contains the device’s MAC address.

Synchronous Communication

> Network devices use a common reference clock source and create time slots for transmission very similar to ,TDM, or ,StatTDM


### Network Layer  (Layer 3) 

In the Network Layer, it is responsible for forwarding traffic ,routing, with the logical address.

The Network layer deals with the IP ,Internet Protocol, the internet Protocol is just one of the protocols that are applied in this layer, of course there are other protocols but this protocol is still the most commonly implemented one. The ,IP, follows 2 different schemes ,IPV4, && ,IPV6, . The latter is a newly designed scheme, both these schemes play a role in assigning hosts, such that the number of host in ,IPV6, far exceeds ,IPV4,.

This layer mainly deals with data in the form of a Packet, when the frame from the Data-Link layer arrives in the Network layer, the Network Layer de-capsulates the frame to form a packet, this packet contains the IP addresses of the DST and SRC.

> How exactly is data forwarded or route the data across the networks

The 3 main ways this is done so : ,Packet Switching, , ,Circuit Switching,, ,Message Switching,.

> In the network layer, the term ,switching, refers to ,routing,, ,not the switch in data-link layer

The most common way of routing is Packet Switching, this is where segmented data are converted to packets via encapsulation in the network layer.

Packet switching,
 is a method of transferring the data to a network in form of packets. In order to transfer the file fast and efficiently manner over the network and minimize the transmission latency, the data is broken into small pieces of variable length, called ,Packet., At the destination, all these small parts (packets) have to be reassembled, belonging to the same file.




This Diagram shows that there are multiple routes from terminal 1 to terminal 2, and so in a real-life context, depending on the network traffic and other variables, the optimal route will be calculated by the router.

Packet Switching uses ,Store and Forward,
 technique while switching the packets; while forwarding the packet each hop first stores that packet then forward. This technique is very beneficial because packets may get discarded at any hop due to some reason. More than one path is possible between a pair of sources and destinations. Each packet contains Source and destination address using which they independently travel through the network. In other words, packets belonging to the same file may or may not travel through the same path. If there is congestion at some path, packets are allowed to choose different paths possible over an existing network.

Hence the entire idea of Packet Switching is, the Data will keep on hopping from one router to the other, until it finds it intended target.

- More efficient in terms of bandwidth, since the concept of reserving circuit is not there.

- Minimal transmission latency.

- More reliable as a destination can detect the missing packet.

- More fault tolerant because packets may follow a different path in case any link is down, Unlike Circuit Switching.

- Cost-effective and comparatively cheaper to implement.

Disadvantages : 

- Packet Switching doesn’t give packets in order, whereas Circuit Switching provides ordered delivery of packets because all the packets follow the same path.

- Since the packets are unordered, we need to provide sequence numbers for each packet.

- Complexity is more at each node because of the facility to follow multiple paths.

- Transmission delay is more because of rerouting.

- Packet Switching is beneficial only for small messages, but for bursty data (large messages) Circuit Switching is better.



Circuit Switching,, this is another way of routing data ; this is where there is a dedicated communication link established between 2 devices .


In the circuit switching, there is a permanent, dedicated link being established, this is when there are already pre-loaded route. Such that the administrator specifically wants the data to be transmitted from terminal 1 to 2 in a specific route.

- Audio Communication



Message Switching, is the third way, the data is routed towards the destination, the Message Switching is a network switching strategy in which data or message is transmitted entirely from the source to the destination node, one hop at a time. Every intermediary switch in the network stores the entire message during message routing. In this routing, dynamic routing is used unlike in circuit routing.

Normally, when the intended DST is not recognized by the intermediate nodes, the data is deleted, or when the DST device is offline. However, in this strategy the Data is stored.

Message Switching –, Message switching was a technique developed as an alternative to circuit switching before packet switching was introduced. In message switching, end-users communicate by sending and receiving ,messages, that included the entire data to be shared. Messages are the smallest individual unit. Also, the sender and receiver are not directly connected. There are a number of intermediate nodes that transfer data and ensure that the message reaches its destination. Message switched data networks are hence called hop-by-hop systems.

They provide 2 distinct and important characteristics:





Differences : 









1. As message switching is able to store the message for which communication channel is not available, it helps in reducing the traffic congestion in the network.

1. In message switching, the data channels are shared by the network devices.

1. It makes traffic management efficient by assigning priorities to the messages.

1. Because the messages are delivered via a store and forward method, it is possible to include priority in them.

1. It allows for infinite message lengths.

1. Unlike circuit switching, it does not necessitate the actual connection of source and destination devices.

1. Message switching cannot be used for real-time applications as storing messages causes delay.

1. In message switching, the message has to be stored for which every intermediate device in the network requires a large storing capacity.

1. Because the system is so intricate, people are frequently unaware of whether or not messages are correctly conveyed. This could cause problems in social relationships.

1. The type of message switching does not create a dedicated path between the devices. It is not dependable communication because there is no direct relationship between sender and receiver.

Applications –

The store-and-forward method was implemented in telegraph message switching centers. Today, although many major networks and systems are packet-switched or circuit-switched networks, their delivery processes can be based on message switching. For example, in most electronic mail systems the delivery process is based on message switching, while the network is in fact either circuit-switched or packet-switched.


### Transport Layer (Layer 4) 

This layer is responsible in providing the communication services directly to the application processes running on different hosts. Basically, this layer exists so as to ensure ,smooth handover of data, . 

The #3 Main Functions of the Transport layer → ,Segmentation, , ,Flow Control, and ,Error Contorl,. In this layer, we are also going to focus on certain protocols and they are ,TCP- Transmission Control Protocol, & ,UDP- User Datagram Protocol, . 

- [ ] Flow control. the best analogy to explain what flow control is, assume that flow control is like a normal road ; A road that has a junction, highway and everything. Let’s the highway speed is 80km/h while the normal lane speed is only 40km/h and beyond that can cause in accidents, to prevent this there is a constable.

1. Buffering, → 

1. Window Scaling, →

- [ ] Segmentation is where, when the Transport Layer receives data from the session layer, it segregates the data into segments, whilst tagging them with a ,SEQ, number, the ,SEQ, number refers to the arrangement of the data. This segmenting gives a lot of advantages : 

- UDP - User Datagram Protocol, →


###  Session Layer (Layer 5)

> The session layer is responsible for connecting, maintaining and exchanging information with other device, as well as authentication.

The session layer is the fifth layer in the OSI model, within this model, a lot of processes take place, Mainly, this session is responsible for establishing a dedicated communication line with another device- the device that sends the data i.e. the Sender.

This connection is supposed to be used for the exchange of information and other things, it also maintains this session and if needed terminates it.

Functions of Session Layer :,The session layer being the fifth layer in the OSI model performs several different as well as important functions which are need for establishing as well as maintaining a safe and secure connection.

```
Data from Presentation Layer <=> Session layer <=> Data from Transport Layer
```
Following are some of the functions which are performed by Session Layer –

- Session Layer works as a dialog controller through which it allows systems to communicate in either half-duplex mode or full duplex mode of communication.

- This layer is also responsible for token management, through which it prevents two users to simultaneously access or attempting the same critical operation.

- This layer allows synchronization by allowing the process of adding checkpoints, which are considered as synchronization points to the streams of data.

- This layer is also responsible for session checkpointing and recovery.

- This layer basically provides a mechanism of opening, closing and managing a session between the end-user application processes.

- The services offered by Session Layer are generally implemented in application environments using remote procedure calls (RPCs).

- The Session Layer is also responsible for synchronizing information from different sources.

- This layer also controls single or multiple connections for each-end user application and directly communicates with both Presentation and transport layers.

- Session Layer creates procedures for checkpointing followed by adjournment, restart and termination.

- Session Layer uses checkpoints to enable communication sessions which are to be resumed from that particular checkpoint at which communication failure has occurred.

- The session Layer is responsible for fetching or receiving data information from its previous layer (transport layer) and further sends data to the layer after it (presentation layer).

Session Layer Protocols :,Session Layer uses some protocols which are required for safe, secure and accurate communication which exists between two-ender user applications.Following are some of the protocols provided or used by the Session Layer –

- AppleTalk Data Stream Protocol (ADSP):, ADSP is that type of protocol which was developed by Apple Inc. and it includes a number of features that allow local area networks to be connected with no prior setup. This protocol was released in 1985. This protocol rigorously followed the OSI model of protocol layering. ADSP itself has two protocols named: AppleTalk Address Resolution Protocol (AARP) and Name Binding Protocol (NBP), both aimed at making system self-configuring.

- Real-time Transport Control Protocol (RTCP):, RTCP is a protocol which provides out-of-band statistics and control information for an RTP (Real-time Transport Protocol) session. RTCP’s primary function is to provide feedback on the quality of service (QoS) in media distribution by periodically sending statistical information such as transmitted octet and packet counts or packet loss to the participants in the streaming multimedia session.

- Point-to-Point Tunneling Protocol (PPTP):, PPTP is a protocol which provides a method for implementing virtual private networks. PPTP uses a TCP control channel and a Generic Routing Encapsulation tunnel to encapsulate PPP (Point-to-Point Protocol) packets This protocol provides security levels and remote access levels comparable with typical VPN (Virtual Private Network) products.

- Password Authentication Protocol (PAP):, Password Authentication Protocol is a password-based authentication protocol used by Point to Point Protocol (PPP) to validate users. Almost all network operating systems, remote servers support PAP. PAP authentication is done at the time of the initial link establishment and verifies the identity of the client using a two-way handshake (Client-sends data and server in return sends Authentication-ACK (Acknowledgement) after the data sent by client is verified completely).

- Remote Procedure Call Protocol (RPCP):, Remote Procedure Call Protocol (RPCP) is a protocol that is used when a computer program causes a procedure (or a sub-routine) to execute in a different address space without the programmer explicitly coding the details for the remote interaction. This is basically the form of client-server interaction, typically implemented via a request-response message-passing system.

- Sockets Direct Protocol (SDP):, Sockets Direct Protocol (SDP) is a protocol that supports streams of sockets over Remote Direct Memory Access (RDMA) network fabrics.The purpose of SDP is to provide an RDMA-accelerated alternative to the TCP protocol. The primary goal is to perform one particular thing in such a manner which is transparent to the application.


### Presentation Layer (Layer 6)

> This layer is basically used to encrypt the data so that the data from the application layer, especially sensitive data is not leaked.


### Application Layer (Layer 7) 


### OSI Model


### Encapsulation and Decapsulation 



