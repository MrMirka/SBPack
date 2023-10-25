import { getData, transformGroupData, transformPlayersData, transformEventData } from "./utilites/Reposotiry";
import { getBannerFromCSV } from "./utilites/Database";
import { createCoordinate } from "./utilites/Utils";
import { Initdata } from "./utilites/Constructor";
import { initBanners } from "./utilites/Utils";

figma.showUI(__html__)

figma.ui.onmessage = (msg) => {
  if (msg.type === 'importCSV') {
    const csvData = msg.data; //CSV данные
    const banners = getBannerFromCSV(csvData) //Данные для запроса в БД
    figma.ui.close();
    getData((data) => {
      let clubs = transformGroupData(data.clubs)
      let unions = transformGroupData(data.unions)
      let players = transformPlayersData(data.players)
      let events = transformEventData(data.events)
      if (clubs && players && unions && events) {
        Initdata(clubs, unions, players, events);
      }
      if (banners) {
        const coordanate = createCoordinate(banners.length, 50, 1080)
        initBanners(banners, coordanate)
      }
    })
  }
};