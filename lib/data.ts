export const personalInfo = {
  name: 'Rishabh Rathod',
  role: 'Staff Frontend Engineer',
  tagline:
    'Building efficient and user-friendly developer tools, websites, and mobile apps with JavaScript, React, and React Native',
  email: 'rishabhrathod2012@gmail.com',
  location: 'Bengaluru, Karnataka, India',
  social: {
    github: 'https://github.com/rishabhrathod01',
    linkedin: 'https://www.linkedin.com/in/rishabhrathod01',
    twitter: 'https://twitter.com/rishabhrathod01',
    instagram: 'https://www.instagram.com/rishabhrathod01',
  },
  about: {
    short:
      'I am a software developer with expertise in JavaScript, React, and React Native. I create developer tools, websites, and mobile apps that are efficient and user-friendly.',
    long: 'With over 5 years of experience in frontend development, I specialize in building performant, scalable web and mobile applications. Currently working as a Staff Frontend Engineer at Prophecy, I&apos;ve contributed to shipping AI agent features and have a proven track record of optimizing performance, building enterprise features, and leading developer-centric initiatives. I&apos;m passionate about creating tools that make developers&apos; lives easier and delivering exceptional user experiences.',
  },
  resume:
    'https://drive.google.com/file/d/1XHhicK78OpWr3hvZA7S-gPS4_zVXtoPa/view?usp=drive_link',
};

export const skills = {
  languages: [
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'English',
    'Gujarati',
    'Hindi',
  ],
  frameworks: [
    'React',
    'React Native',
    'Next.js',
    'Redux',
    'Gatsby',
    'Material UI',
  ],
  tools: ['Git', 'Webpack', 'Firebase', 'FFMPEG', 'VS Code', 'Unit Testing'],
  design: [
    'Front-End Development',
    'Responsive Design',
    'UI/UX Design',
    'Performance Optimization',
    'SEO',
  ],
};

export const experience = [
  {
    company: 'Prophecy',
    position: 'Staff Frontend Engineer',
    period: 'December 2024 - Present',
    description:
      'Contributing to AI-powered data engineering platform features and innovations.',
    achievements: [
      'Shipped AI agent features for data exploration, comparison, and pipeline generation using AI',
      'Working on cutting-edge AI integration for enterprise data workflows',
    ],
  },
  {
    company: 'Appsmith',
    position: 'Senior Frontend Engineer',
    period: 'June 2023 - December 2024',
    description:
      'Led enterprise feature development and performance optimization for the low-code platform.',
    achievements: [
      'Developed Packages feature, improving reusability of queries and logic across workspaces, driving increased enterprise sales',
      'Built Generate CRUD feature, enabling users to create fully functional apps in under 10 seconds',
      'Optimized JavaScript evaluation engine, boosting performance by over 200% and reducing initial app load time from 5s to under 1s',
      'Led developer-centric features like JS Object mutation and widget property setters, contributing to 30% improvement in user activation',
      'Conducted knowledge transfer sessions as code owner for JavaScript evaluation engine',
    ],
  },
  {
    company: 'Appsmith',
    position: 'Frontend Engineer',
    period: 'June 2021 - June 2023',
    description:
      'Contributed to the development of low-code platform features and user experience improvements.',
    achievements: [
      'Built and shipped multiple features for the Appsmith platform',
      'Collaborated with cross-functional teams to deliver high-quality solutions',
    ],
  },
  {
    company: 'Streak AI Technologies Pvt Ltd',
    position: 'Frontend Developer',
    period: 'July 2019 - June 2021',
    description:
      'Developed high-performance web and mobile solutions for fintech platform.',
    achievements: [
      'Reduced website bundle size by 65%, improving First Contentful Paint from 4.0s to 1.8s via code splitting and lazy-loading',
      'Built platform-independent charting solution using customized TradingView Lite for React Native and web',
      'Developed responsive website using Gatsby with >90 SEO score on Lighthouse',
      'Led development of custom React Native components and integrated push notifications across multiple Firebase instances',
      'Implemented Dark Theme using Material UI and created CSS-to-JS conversion tool',
      'Built internal Android dialer app integrated with CRM API to automate customer support calls',
    ],
  },
  {
    company: 'Blackboard Radio',
    position: 'React Native Developer',
    period: 'April 2019 - June 2019',
    description: 'Developed mobile app features for audio content platform.',
    achievements: [
      'Developed Quiz module for the BBR app, enhancing user engagement',
      'Implemented audio trimming and merging functionality using FFMPEG scripts and react-native-ffmpeg',
    ],
  },
  {
    company: 'Shoptree',
    position: 'Software Developer',
    period: 'August 2018 - March 2019',
    description: 'Built mobile application for online food ordering platform.',
    achievements: [
      'Developed mobile application using React Native for online food ordering',
      'Managed state using Redux and Redux-thunk',
    ],
  },
];

export const projects = [
  {
    title: 'DiffyCurl',
    description:
      'A powerful developer tool for comparing API responses. Helps developers identify differences between multiple API endpoints, track API changes, and debug response variations efficiently.',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['Developer Tools', 'API', 'CLI', 'Open Source'],
    liveUrl: '',
    githubUrl: 'https://github.com/rishabhrathod01/DiffyCurl',
    featured: true,
  },
  {
    title: 'CSS to JS - VS Code Extension',
    description:
      'A VS Code extension that converts CSS styles to JavaScript objects instantly. Streamlines the workflow for developers working with CSS-in-JS libraries like styled-components and emotion. Published on VS Code Marketplace.',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['VS Code', 'Extension', 'CSS', 'JavaScript', 'Developer Tools'],
    liveUrl: 'https://marketplace.visualstudio.com/items?itemName=rishabh-rathod.css-to-js',
    githubUrl: 'https://github.com/rishabhrathod01/css-to-js',
    featured: true,
  },
];

export const education = [
  {
    institution: 'SJB Institute of Technology',
    degree: 'Bachelor of Engineering',
    field: 'Computer Science and Engineering',
    period: '2015 - 2019',
    location: 'Bengaluru, Karnataka, India',
  },
  {
    institution: 'Lions English School',
    degree: 'SSC, HSC',
    field: 'Secondary Education',
    period: '2013 - 2015',
    location: 'India',
  },
];
