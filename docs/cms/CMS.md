# CMS Manager

Technologies: Strapi Headless CMS

## How to change Banners

Access by loggin in at Strapi

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/1.png)

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/2.png)

Or access from this
[Direct Link](https://enduring-pleasure-5ea5ad0117.strapiapp.com/admin)

## How to modify content

1. Go to content managment

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/3.png)

2. Go to Global Banners

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/4.png)

3. There are some records already in order to help to understand the logic (it mimics what we had hardcoded before)

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/5.png)

4. You will see options, we have pretty much 3 types of banners
   - Details Banner - which opens details modal
   - Simple CTA - which has a button that goes to the link we decides (we can use relative paths, like /profile)
   - Just texts - Which contains pure text and a banner as background

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/6.png)
![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/7.png)
![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/8.png)

5. Be sure you save and then publish, otherwise it will just be a draft.

![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/9.png)
![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/10.png)
![Image Alt Text](https://github.com/ridotto-io/play.ridotto-interface/raw/develop/docs/cms/11.png)

## Considerations

1. Random backgrounds are images that the app will show randomly, if you dont want this behavior, just use 1 image.
2. Exclusive option: this means you can make the banner appear globally (as it was before), or just when the user is on profile/x page. (since we had this behavior in the past, we kept it on the CMS level)
3. Leave empty options when you dont want to replace the default ones, like ICON, the icon must be an absolute URL
4. If you find weird behaviors when changing texts like on SubTitle, be sure you are not copy and apsting from other places, some times it brings style we dont want, like when you copy text and apste it on GMAIL or other apps.
5. We can choose the language, you need to recreate the banners on every language we support, when the user change from EN to FR on ridotto play website, will call the CMS and bring the correct banners.
