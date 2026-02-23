const projects = [
    {
        id: "off-road",
        title: "Off Road Autonomy",
        image: "src/images/offroad.gif",
        cardImage: "src/images/offroad.gif",
        highlights: [
            "PI: Dr Adam Hoover, Holcombe Department of Electrical and Computer Engineering, Clemson University",
            "Video based neural network",
            "Dataset generation from Clemson Experimental Forest",
            "Annotation and developing CNN pipeline"
        ],
        tools: "Python, C++, OpenCV, TensorFlow, HPC",
        description: ""
    },
    {
        id: "sev-wea",
        title: "Drivable Area Detection",
        image: "src/images/severe_sq.png",
        cardImage: "src/images/severe.gif",
        highlights: [
            "Team of 3",
            "20 Layer DNN Network",
            "Encoder-Decoder configuration",
            "15.6K selected images from BDD100K dataset",
            "Pipeline that processes video to recognize drivable areas",
            "Built with Palmetto HPC - Clemson University",
            "Achieved mIOU = 44.15%"
        ],
        links: [
            { type: "github", url: "https://github.com/ppswaroopa/Lane-Detection-In-Foggy-Weather" },
            { type: "youtube", url: "https://youtu.be/N1VKDhaKGTs" }
        ],
        tools: "Python, OpenCV, TensorFlow, HPC, Jupyter Notebook",
        description: "Developed a neural network to help vehicles find traversable paths in non-ideal weather conditions. Built a simple Encoder-Decoder network and selected BDD100K images tagged with rainy, foggy, snowy, and cloudy conditions for targeted training."
    },
    {
        id: "autobot",
        title: "Autonomous Turtlebot",
        image: "src/images/auto_bot.gif",
        cardImage: "src/images/auto_bot.gif",
        highlights: [
            "Led a team of 4",
            "Developed PID controllers using LIDAR for obstacle avoidance",
            "Implemented line following and STOP sign response using miniYOLO",
            "Optimized testing with automated data transmission cron jobs",
            "Received highest grade in class for successful implementation"
        ],
        links: [
            { type: "github", url: "https://github.com/ppswaroopa/Aue8230Spring2022_Group7/tree/main/group7_ws/src/auefinals" },
            { type: "youtube", url: "https://youtu.be/YXchdEtqzsE" }
        ],
        tools: "Python, ROS, OpenCV, miniYOLO, Raspberry Pi, Ubuntu"
    },
    {
        id: "astar",
        title: "A* Route Planner",
        image: "src/images/ND_aStar.png",
        cardImage: "src/images/ND_aStar.png",
        highlights: [
            "Project built in Ubuntu Linux",
            "Uses maps from OpenStreetMap library",
            "Implemented core logic using OOP in C++",
            "Completed as part of Udacity C++ Nanodegree"
        ],
        links: [
            { type: "github", url: "https://github.com/ppswaroopa/route_planner_ND" }
        ],
        tools: "C++, CMake, OpenStreetMap, Ubuntu"
    },
    {
        id: "sysmon",
        title: "Linux System Monitor",
        image: "src/images/sysmon.png",
        cardImage: "src/images/sysmon.png",
        highlights: [
            "Developed in C++ to mimic htop/top functionality",
            "Parses system data from the Linux 'proc' directory",
            "Deep implementation of file reading and data parsing",
            "Understanding of process management in Linux"
        ],
        links: [
            { type: "github", url: "https://github.com/ppswaroopa/Linux-System-Monitor" }
        ],
        tools: "C++, CMake, Ubuntu"
    },
    {
        id: "snakegame",
        title: "Snake Game",
        image: "src/images/snakegame.gif",
        cardImage: "src/images/snakegame.gif",
        highlights: [
            "Improvised C++ implementation of the classic Snake Game",
            "Full use of OOP concepts (encapsulation, polymorphism, abstraction)",
            "Implemented Game Design Patterns",
            "Optimized memory with pointers and speed with multithreading"
        ],
        links: [
            { type: "github", url: "https://github.com/ppswaroopa/Snake-Game" }
        ],
        tools: "C++, CMake, Ubuntu"
    },
    {
        id: "agrawal-lab",
        title: "Web Development",
        image: "src/images/agrawal-lab.png",
        cardImage: "src/images/agrawal-lab.png",
        highlights: [
            "Public lab website for Agrawal Lab (neuroscience)",
            "Built with emphasis on ease of maintenance",
            "Developed internal tools using SharePoint as well"
        ],
        tools: "WIX, HTML, CSS, JS",
        description: "Public-facing website created for Agrawal Lab, focused on Drosophila Melanogaster research. Visit at agrawallab.com"
    }
];
