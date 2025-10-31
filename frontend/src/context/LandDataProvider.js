import React from "react";
import LandDataContext from "./LandDataContext";

const landData = [
  {
    id: "0",
    side: "left",
    friendName: "Cal",
    friendType: "The Calculator",
    moduleName: "financial mathematics",
    moduleDecriptionKids:
      "Hey there, little mathematicians! I'm Calc the Cheerful Calculator, and I'm super excited to take you on an amazing adventure in \"Numberland.\" We'll have loads of fun playing games with numbers, learning how to add up our pocket money, and even figure out the best ways to save for those awesome toys we've been dreaming about!",
    moduleDescriptionParents:
      "For Parents: Calc's module introduces essential financial concepts to children, including basic budgeting, understanding value for money, and the fundamentals of saving. It's designed to build a strong foundation in financial literacy, encouraging skills that are vital for sound money management in the future.",
    friendImage: "/friends/friend0.png",
    landImage: "/lands/land0.jpg",
    name: "Numberland",
    progress: "50",
  },
  {
    id: "1",
    side: "right",
    friendName: "Olivia",
    friendType: "The Owl",
    moduleName: "saving",
    moduleDecriptionKids:
      "Hello, my savvy savers! I'm Hootie the Wise Saving Owl, and I can't wait to share the secrets of \"Savings Treehouse\" with you. We're going to learn all about saving money, finding fun ways to watch our piggy banks get fuller, and dreaming about all the cool things we can do with our savings!",
    moduleDescriptionParents:
      "For Parents: In Hootie's module, children will delve into the practice of saving, differentiating between needs and wants, and the importance of emergency funds. The lessons are geared towards fostering sound saving habits from an early age, emphasizing financial security and long-term planning.",
    friendImage: "/friends/friend1.png",
    landImage: "/lands/land1.jpg",
    name: "Savings Treehouse",
    progress: "0",
  },
  {
    id: "2",
    side: "left",
    friendName: "Timmy",
    friendType: "The Turtle",
    moduleName: "taxes",
    moduleDecriptionKids:
      "Hello, young explorers! I'm Timmy the Tax-Smart Turtle, and I'm here to take you on an exciting journey through \"Taxtown.\" Together, we'll learn about the mysterious world of taxes in a super fun and easy way. We'll discover why our families pay taxes, and how they help build parks, schools, and so much more!",
    moduleDescriptionParents:
      "For Parents: This module provides a basic introduction to taxes, helping children understand their significance in everyday life, including sales and income tax. It's crafted to instill a sense of responsibility and community awareness, laying the groundwork for informed and responsible future citizens.",
    friendImage: "/friends/friend2.png",
    landImage: "/lands/land2.jpg",
    name: "TaxTown",
    progress: "100",
  },
  {
    id: "3",
    side: "right",
    friendName: "Fiona",
    friendType: "The Fox",
    moduleName: "investing",
    moduleDecriptionKids:
      "Hi, future money maestros! I'm Finn the Friendly Fox, and I'm here in \"Investment Woods\" to show you how to make your money do amazing tricks! We're going to learn all about investments, watch money grow, and have a blast understanding the smart ways to use our savings.",
    moduleDescriptionParents:
      "For Parents: Finn's module demystifies investing for young learners, covering the basics of stocks, bonds, and the need for diversification. It provides an engaging introduction to financial growth concepts and the significance of strategic long-term planning.",
    friendImage: "/friends/friend3.png",
    landImage: "/lands/land3.jpg",
    name: "Investment Woods",
    progress: "80",
  },
  {
    id: "4",
    side: "left",
    friendName: "Bart",
    friendType: "The Beaver",
    moduleName: "financial mathematics",
    moduleDecriptionKids:
      "Hey there, friends! I'm Bucky the Build-It Beaver, and I'm super excited to help you understand the world of loans here at \"Loan Lake.\" We'll learn about borrowing money for important things and discover how to plan for our big dreams and future projects!",
    moduleDescriptionParents:
      "For Parents: Bucky's module educates children on the principles of loans, including the concept of interest rates and the importance of credit scores. It aims to teach responsible borrowing habits and the impact of these financial decisions on future opportunities.",
    friendImage: "/friends/friend4.png",
    landImage: "/lands/land4.jpg",
    name: "Loan Lake",
    progress: "60",
  },
  {
    id: "5",
    side: "right",
    friendName: "Cleo",
    friendType: "The Chameleon",
    moduleName: "freestyle",
    moduleDecriptionKids:
      "Hello, creative minds! I'm Cleo the Colorful Chameleon from \"Imagination Jungle.\" Let's have a blast exploring all the different and fun ways we can think about money. From setting up a lemonade stand to saving for something special, we'll use our creativity to make our financial dreams come true!",
    moduleDescriptionParents:
      "For Parents: Chroma's module is designed to inspire creative thinking about finance, covering topics like entrepreneurship, ethical spending, and philanthropy. It encourages children to view money as a tool for creativity, personal expression, and making a positive impact in the world.",
    friendImage: "/friends/friend5.png",
    landImage: "/lands/land5.jpg",
    name: "Imagination Jungle",
    progress: "20",
  },
];

export const LandDataProvider = ({ children }) => {
  return (
    <LandDataContext.Provider value={landData}>
      {children}
    </LandDataContext.Provider>
  );
};
