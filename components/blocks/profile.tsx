import { Gallery4, Gallery4Props } from "./gallery4";

const demoData: Gallery4Props = {
  title: "Top Creators",
  description:
    "",
    items : [
    {
      "id": "carryminati",
      "title": "CarryMinati: The King of Indian Roasting",
      "description": "Explore how CarryMinati revolutionized content creation with his unique roasting and gaming videos, making him one of India's most popular YouTubers.",
      "href": "https://www.youtube.com/c/CarryMinati",
      "image": "https://i.pinimg.com/474x/09/cb/d1/09cbd173774cc2f3f9f7f7db869d0473.jpg"
    },
    {
      "id": "bbkivines",
      "title": "BB Ki Vines: Comedy That Connects",
      "description": "Discover how Bhuvan Bam's BB Ki Vines became a household name in India with his relatable, humorous storytelling and iconic characters.",
      "href": "https://www.youtube.com/c/BBKiVines",
      "image": "https://i.pinimg.com/474x/41/09/97/41099773023c2e18ce754477cb95b54a.jpg"
    },
    {
      "id": "technicalguruji",
      "title": "Technical Guruji: Simplifying Tech for India",
      "description": "Learn how Gaurav Chaudhary, aka Technical Guruji, became India's most trusted tech YouTuber by providing easy-to-understand tech reviews and insights.",
      "href": "https://www.youtube.com/c/TechnicalGuruji",
      "image": "https://i.pinimg.com/474x/76/b6/f4/76b6f4c8d64f40bacc2f4f2fc2804bcc.jpg"
    },
    {
      "id": "ashishchanchlani",
      "title": "Ashish Chanchlani: Comedy That Breaks the Internet",
      "description": "See how Ashish Chanchlani's hilarious sketches and relatable content have made him one of India's most beloved content creators.",
      "href": "https://www.youtube.com/c/ashishchanchlanivines",
      "image": "https://i.pinimg.com/474x/aa/ea/f4/aaeaf4f7f29478521c0c0bb91ac478f1.jpg"
    },
    {
      "id": "mrunalpanchal",
      "title": "Mrunal Panchal: The Queen of Beauty & Fashion",
      "description": "Explore how Mrunal Panchal built a massive following through her beauty, fashion, and lifestyle content, making her one of India's top influencers.",
      "href": "https://www.instagram.com/mrunu",
      "image": "https://i.pinimg.com/474x/67/9e/7c/679e7ca521426d18fed09115aa6faef3.jpg"
    }
  ]
};

function Gallery4Demo() {
  return <Gallery4 {...demoData} />;
}

export { Gallery4Demo };
