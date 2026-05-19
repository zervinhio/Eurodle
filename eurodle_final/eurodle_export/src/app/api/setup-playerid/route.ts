import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PlayerIdGame from "@/lib/models/PlayerIdGame";

const PLAYERS_TO_INSERT = [
  // =========================================================================
  // --- MAIN PLAYERS & MODERN LEGENDS (Μπορούν να κληρωθούν ως κρυφοί παίκτες) ---
  // =========================================================================
  {
    name: "Kostas Sloukas",
    career: [ { team: "Olympiacos", years: "2008-2015" }, { team: "Fenerbahce", years: "2015-2020" }, { team: "Olympiacos", years: "2020-2023" }, { team: "Panathinaikos", years: "2023-Present" } ],
    hints: { jersey: "#16", position: "PG", nationality: "Greece" }
  },
  {
    name: "Mike James",
    career: [ { team: "Baskonia", years: "2014-2016" }, { team: "Panathinaikos", years: "2016-2017" }, { team: "Olimpia Milano", years: "2018-2019" }, { team: "CSKA Moscow", years: "2019-2021" }, { team: "AS Monaco", years: "2021-Present" } ],
    hints: { jersey: "#55", position: "PG", nationality: "USA" }
  },
  {
    name: "Nikola Mirotic",
    career: [ { team: "Real Madrid", years: "2008-2014" }, { team: "Chicago Bulls (NBA)", years: "2014-2018" }, { team: "Barcelona", years: "2019-2023" }, { team: "Olimpia Milano", years: "2023-Present" } ],
    hints: { jersey: "#33", position: "PF", nationality: "Spain / Montenegro" }
  },
  {
    name: "Walter Tavares",
    career: [ { team: "Gran Canaria", years: "2009-2015" }, { team: "Atlanta Hawks (NBA)", years: "2015-2017" }, { team: "Real Madrid", years: "2017-Present" } ],
    hints: { jersey: "#22", position: "C", nationality: "Cape Verde" }
  },
  {
    name: "Kevin Punter",
    career: [ { team: "Olympiacos", years: "2019" }, { team: "Crvena Zvezda", years: "2019-2020" }, { team: "Olimpia Milano", years: "2020-2021" }, { team: "Partizan", years: "2021-2024" }, { team: "Barcelona", years: "2024-Present" } ],
    hints: { jersey: "#0", position: "SG", nationality: "USA" }
  },
  {
    name: "Facundo Campazzo",
    career: [ { team: "Real Madrid", years: "2014-2015" }, { team: "UCAM Murcia", years: "2015-2017" }, { team: "Real Madrid", years: "2017-2020" }, { team: "Denver Nuggets (NBA)", years: "2020-2022" }, { team: "Crvena Zvezda", years: "2022-2023" }, { team: "Real Madrid", years: "2023-Present" } ],
    hints: { jersey: "#7", position: "PG", nationality: "Argentina" }
  },
  {
    name: "Mario Hezonja",
    career: [ { team: "Barcelona", years: "2012-2015" }, { team: "Orlando / NY / Portland (NBA)", years: "2015-2020" }, { team: "Panathinaikos", years: "2021" }, { team: "UNICS Kazan", years: "2021-2022" }, { team: "Real Madrid", years: "2022-Present" } ],
    hints: { jersey: "#11", position: "SF", nationality: "Croatia" }
  },
  {
    name: "Mathias Lessort",
    career: [ { team: "Crvena Zvezda", years: "2017-2018" }, { team: "Bayern Munich", years: "2019-2020" }, { team: "Maccabi Tel Aviv", years: "2021" }, { team: "Partizan", years: "2021-2023" }, { team: "Panathinaikos", years: "2023-Present" } ],
    hints: { jersey: "#26", position: "C", nationality: "France" }
  },
  {
    name: "Kendrick Nunn",
    career: [ { team: "Miami Heat (NBA)", years: "2019-2021" }, { team: "LA Lakers (NBA)", years: "2021-2023" }, { team: "Washington Wizards (NBA)", years: "2023" }, { team: "Panathinaikos", years: "2023-Present" } ],
    hints: { jersey: "#25", position: "SG", nationality: "USA" }
  },
  {
    name: "Sasha Vezenkov",
    career: [ { team: "Aris", years: "2011-2015" }, { team: "Barcelona", years: "2015-2018" }, { team: "Olympiacos", years: "2018-2023" }, { team: "Sacramento Kings (NBA)", years: "2023-2024" }, { team: "Olympiacos", years: "2024-Present" } ],
    hints: { jersey: "#14", position: "PF", nationality: "Bulgaria" }
  },
  {
    name: "Shane Larkin",
    career: [ { team: "Dallas / Brooklyn (NBA)", years: "2013-2016" }, { team: "Baskonia", years: "2016-2017" }, { team: "Boston Celtics (NBA)", years: "2017-2018" }, { team: "Anadolu Efes", years: "2018-Present" } ],
    hints: { jersey: "#0", position: "PG", nationality: "USA / Turkey" }
  },
  {
    name: "Will Clyburn",
    career: [ { team: "Darussafaka", years: "2016-2017" }, { team: "CSKA Moscow", years: "2017-2022" }, { team: "Anadolu Efes", years: "2022-2024" }, { team: "Virtus Bologna", years: "2024-Present" } ],
    hints: { jersey: "#21", position: "SF", nationality: "USA" }
  },
  {
    name: "Nikola Milutinov",
    career: [ { team: "Partizan", years: "2012-2015" }, { team: "Olympiacos", years: "2015-2020" }, { team: "CSKA Moscow", years: "2020-2023" }, { team: "Olympiacos", years: "2023-Present" } ],
    hints: { jersey: "#33", position: "C", nationality: "Serbia" }
  },
  {
    name: "Tornike Shengelia",
    career: [ { team: "Charleroi", years: "2011-2012" }, { team: "Brooklyn / Chicago (NBA)", years: "2012-2014" }, { team: "Baskonia", years: "2014-2020" }, { team: "CSKA Moscow", years: "2020-2022" }, { team: "Virtus Bologna", years: "2022-Present" } ],
    hints: { jersey: "#21", position: "PF", nationality: "Georgia" }
  },
  {
    name: "Marco Belinelli",
    career: [ { team: "Fortitudo Bologna", years: "2002-2007" }, { team: "Various Teams (NBA)", years: "2007-2020" }, { team: "Virtus Bologna", years: "2020-Present" } ],
    hints: { jersey: "#3", position: "SG", nationality: "Italy" }
  },
  {
    name: "Thomas Walkup",
    career: [ { team: "Ludwigsburg", years: "2017-2018" }, { team: "Zalgiris Kaunas", years: "2018-2021" }, { team: "Olympiacos", years: "2021-Present" } ],
    hints: { jersey: "#0", position: "PG", nationality: "USA / Greece" }
  },
  {
    name: "Marius Grigonis",
    career: [ { team: "Tenerife / ALBA", years: "2016-2018" }, { team: "Zalgiris Kaunas", years: "2018-2021" }, { team: "CSKA Moscow", years: "2021-2022" }, { team: "Panathinaikos", years: "2022-Present" } ],
    hints: { jersey: "#40", position: "SG", nationality: "Lithuania" }
  },
  {
    name: "Nicolo Melli",
    career: [ { team: "Olimpia Milano", years: "2010-2015" }, { team: "Brose Bamberg", years: "2015-2017" }, { team: "Fenerbahce", years: "2017-2019" }, { team: "Pelicans / Mavs (NBA)", years: "2019-2021" }, { team: "Olimpia Milano", years: "2021-2024" }, { team: "Fenerbahce", years: "2024-Present" } ],
    hints: { jersey: "#9", position: "PF", nationality: "Italy" }
  },
  {
    name: "Shavon Shields",
    career: [ { team: "Trento", years: "2017-2018" }, { team: "Baskonia", years: "2018-2020" }, { team: "Olimpia Milano", years: "2020-Present" } ],
    hints: { jersey: "#31", position: "SF", nationality: "USA / Denmark" }
  },
  {
    name: "Nigel Hayes-Davis",
    career: [ { team: "Galatasaray", years: "2018-2019" }, { team: "Zalgiris Kaunas", years: "2019-2021" }, { team: "Barcelona", years: "2021-2022" }, { team: "Fenerbahce", years: "2022-Present" } ],
    hints: { jersey: "#11", position: "SF", nationality: "USA" }
  },
  {
    name: "Jan Vesely",
    career: [ { team: "Partizan", years: "2008-2011" }, { team: "Washington / Denver (NBA)", years: "2011-2014" }, { team: "Fenerbahce", years: "2014-2022" }, { team: "Barcelona", years: "2022-Present" } ],
    hints: { jersey: "#24", position: "C", nationality: "Czech Republic" }
  },
  {
    name: "Nikola Kalinic",
    career: [ { team: "Crvena Zvezda", years: "2014-2015" }, { team: "Fenerbahce", years: "2015-2020" }, { team: "Valencia", years: "2020-2021" }, { team: "Crvena Zvezda", years: "2021-2022" }, { team: "Barcelona", years: "2022-2024" }, { team: "Crvena Zvezda", years: "2024-Present" } ],
    hints: { jersey: "#12", position: "SF", nationality: "Serbia" }
  },
  {
    name: "Bryant Dunston",
    career: [ { team: "Olympiacos", years: "2013-2015" }, { team: "Anadolu Efes", years: "2015-2023" }, { team: "Virtus Bologna", years: "2023-2024" }, { team: "Zalgiris Kaunas", years: "2024-Present" } ],
    hints: { jersey: "#42", position: "C", nationality: "USA / Armenia" }
  },
  {
    name: "Daniel Hackett",
    career: [ { team: "Siena", years: "2012-2013" }, { team: "Olimpia Milano", years: "2013-2015" }, { team: "Olympiacos", years: "2015-2017" }, { team: "Brose Bamberg", years: "2017-2018" }, { team: "CSKA Moscow", years: "2018-2022" }, { team: "Virtus Bologna", years: "2022-Present" } ],
    hints: { jersey: "#23", position: "PG", nationality: "Italy" }
  },
  {
    name: "Scottie Wilbekin",
    career: [ { team: "Darussafaka", years: "2015-2018" }, { team: "Maccabi Tel Aviv", years: "2018-2022" }, { team: "Fenerbahce", years: "2022-Present" } ],
    hints: { jersey: "#1", position: "PG", nationality: "USA / Turkey" }
  },
  {
    name: "Vincent Poirier",
    career: [ { team: "Baskonia", years: "2017-2019" }, { team: "Real Madrid", years: "2021-2024" }, { team: "Anadolu Efes", years: "2024-Present" } ],
    hints: { jersey: "#17", position: "C", nationality: "France" }
  },
  {
    name: "Stephane Lasme",
    career: [ { team: "Partizan", years: "2008-2009" }, { team: "Maccabi Tel Aviv", years: "2009-2010" }, { team: "Panathinaikos", years: "2012-2014" }, { team: "Anadolu Efes", years: "2014-2015" }, { team: "Panathinaikos", years: "2018-2019" } ],
    hints: { jersey: "#13", position: "C", nationality: "Gabon" }
  },
  {
    name: "Marko Guduric",
    career: [ { team: "Crvena Zvezda", years: "2015-2017" }, { team: "Fenerbahce", years: "2017-2019" }, { team: "Memphis Grizzlies (NBA)", years: "2019-2020" }, { team: "Fenerbahce", years: "2020-Present" } ],
    hints: { jersey: "#23", position: "SG", nationality: "Serbia" }
  },
  {
    name: "Donta Hall",
    career: [ { team: "AS Monaco", years: "2021-2024" }, { team: "Baskonia", years: "2024-Present" } ],
    hints: { jersey: "#45", position: "C", nationality: "USA / Azerbaijan" }
  },
  {
    name: "Isaiah Canaan",
    career: [ { team: "UNICS Kazan", years: "2021-2022" }, { team: "Olympiacos", years: "2022-2024" }, { team: "Crvena Zvezda", years: "2024-Present" } ],
    hints: { jersey: "#3", position: "SG", nationality: "USA" }
  },
  {
    name: "Daniel Theis",
    career: [ { team: "Brose Bamberg", years: "2014-2017" }, { team: "Boston Celtics (NBA)", years: "2017-2021" }, { team: "Various Teams (NBA)", years: "2021-Present" } ],
    hints: { jersey: "#10", position: "C", nationality: "Germany" }
  },
  {
    name: "Dwayne Bacon",
    career: [ { team: "AS Monaco", years: "2021-2022" }, { team: "Panathinaikos", years: "2022-2023" } ],
    hints: { jersey: "#24", position: "SF", nationality: "USA" }
  },
  {
    name: "Dzanan Musa",
    career: [ { team: "Anadolu Efes", years: "2021" }, { team: "Breogan", years: "2021-2022" }, { team: "Real Madrid", years: "2022-Present" } ],
    hints: { jersey: "#31", position: "SF", nationality: "Bosnia and Herzegovina" }
  },
  {
    name: "Filip Petrusev",
    career: [ { team: "Anadolu Efes", years: "2021-2022" }, { team: "Crvena Zvezda", years: "2022-2023" }, { team: "Olympiacos", years: "2023-2024" }, { team: "Crvena Zvezda", years: "2024-Present" } ],
    hints: { jersey: "#30", position: "PF", nationality: "Serbia" }
  },
  {
    name: "James Anderson",
    career: [ { team: "Zalgiris Kaunas", years: "2014-2015" }, { team: "Darussafaka", years: "2016-2017" }, { team: "Khimki", years: "2017-2018" }, { team: "Anadolu Efes", years: "2018-2022" } ],
    hints: { jersey: "#21", position: "SF", nationality: "USA" }
  },
  {
    name: "Zach LeDay",
    career: [ { team: "Olympiacos", years: "2018-2019" }, { team: "Zalgiris Kaunas", years: "2019-2020" }, { team: "Olimpia Milano", years: "2020-2021" }, { team: "Partizan", years: "2021-2024" }, { team: "Olimpia Milano", years: "2024-Present" } ],
    hints: { jersey: "#2", position: "PF", nationality: "USA / Azerbaijan" }
  },
  {
    name: "Wade Baldwin",
    career: [ { team: "Olympiacos", years: "2019-2020" }, { team: "Bayern Munich", years: "2020-2021" }, { team: "Baskonia", years: "2021-2022" }, { team: "Maccabi Tel Aviv", years: "2022-2024" }, { team: "Fenerbahce", years: "2024-Present" } ],
    hints: { jersey: "#5", position: "PG", nationality: "USA" }
  },
  {
    name: "P.J. Tucker",
    career: [ { team: "Hapoel Holon", years: "2008" }, { team: "Brose Baskets", years: "2011-2012" }, { team: "Various Teams (NBA)", years: "2012-Present" } ],
    hints: { jersey: "#4", position: "PF", nationality: "USA" }
  },
  {
    name: "Brandon Boston Jr.",
    career: [ { team: "LA Tactics (NBA)", years: "2021-2024" }, { team: "Fenerbahce", years: "2025-Present" } ],
    hints: { jersey: "#4", position: "SG", nationality: "USA" }
  },
  {
    name: "Thomas Heurtel",
    career: [ { team: "Baskonia", years: "2011-2014" }, { team: "Anadolu Efes", years: "2014-2017" }, { team: "Barcelona", years: "2017-2021" }, { team: "Real Madrid", years: "2021-2022" } ],
    hints: { jersey: "#13", position: "PG", nationality: "France" }
  },
  {
    name: "Evan Fournier",
    career: [ { team: "Denver / Orlando / NY (NBA)", years: "2012-2024" }, { team: "Olympiacos", years: "2024-Present" } ],
    hints: { jersey: "#94", position: "SG", nationality: "France" }
  },
  {
    name: "Shaquielle McKissic",
    career: [ { team: "Darussafaka", years: "2017" }, { team: "Olympiacos", years: "2020-Present" } ],
    hints: { jersey: "#77", position: "SF", nationality: "USA / Azerbaijan" }
  },
  {
    name: "Cedi Osman",
    career: [ { team: "Anadolu Efes", years: "2011-2017" }, { team: "Cleveland Cavaliers (NBA)", years: "2017-2023" }, { team: "Panathinaikos", years: "2024-Present" } ],
    hints: { jersey: "#16", position: "SF", nationality: "Turkey" }
  },
  {
    name: "Tonye Jekiri",
    career: [ { team: "ASVEL", years: "2019-2020" }, { team: "Baskonia", years: "2020-2021" }, { team: "UNICS Kazan", years: "2021-2022" }, { team: "Fenerbahce", years: "2022-2023" }, { team: "CSKA Moscow", years: "2023-Present" } ],
    hints: { jersey: "#23", position: "C", nationality: "Nigeria" }
  },
  {
    name: "Duane Washington Jr.",
    career: [ { team: "Indiana / Phoenix / NY (NBA)", years: "2021-2024" }, { team: "Partizan", years: "2024-Present" } ],
    hints: { jersey: "#4", position: "PG", nationality: "USA / Serbia" }
  },
  {
    name: "Darius Thompson",
    career: [ { team: "Baskonia", years: "2022-2023" }, { team: "Anadolu Efes", years: "2023-Present" } ],
    hints: { jersey: "#13", position: "PG", nationality: "USA / Italy" }
  },
  {
    name: "Matt Costello",
    career: [ { team: "Baskonia", years: "2021-2024" }, { team: "Valencia", years: "2024-Present" } ],
    hints: { jersey: "#24", position: "C", nationality: "USA / Ivory Coast" }
  },
  {
    name: "Luca Vildoza",
    career: [ { team: "Baskonia", years: "2017-2021" }, { team: "Crvena Zvezda", years: "2022-2023" }, { team: "Panathinaikos", years: "2023-2024" }, { team: "Olympiacos", years: "2024-Present" } ],
    hints: { jersey: "#2", position: "PG", nationality: "Argentina" }
  },
  {
    name: "Carsen Edwards",
    career: [ { team: "Boston Celtics (NBA)", years: "2019-2021" }, { team: "Fenerbahce", years: "2022-2023" }, { team: "Bayern Munich", years: "2023-Present" } ],
    hints: { jersey: "#3", position: "PG", nationality: "USA" }
  },
  {
    name: "Nigel Williams-Goss",
    career: [ { team: "Olympiacos", years: "2018-2019" }, { team: "Real Madrid", years: "2021-2023" }, { team: "Olympiacos", years: "2023-Present" } ],
    hints: { jersey: "#0", position: "PG", nationality: "USA" }
  },
  {
    name: "Sylvain Francisco",
    career: [ { team: "Bayern Munich", years: "2023-2024" }, { team: "Zalgiris Kaunas", years: "2024-Present" } ],
    hints: { jersey: "#2", position: "PG", nationality: "France" }
  },
  {
    name: "Ignas Brazdeikis",
    career: [ { team: "Zalgiris Kaunas", years: "2022-2023" }, { team: "Olympiacos", years: "2023-2024" }, { team: "Zalgiris Kaunas", years: "2024-Present" } ],
    hints: { jersey: "#17", position: "SF", nationality: "Lithuania / Canada" }
  },
  {
    name: "Moses Wright",
    career: [ { team: "Merkezefendi", years: "2023" }, { team: "Olympiacos", years: "2024-Present" } ],
    hints: { jersey: "#80", position: "C", nationality: "USA" }
  },

  // --- THE CORE LEGENDS (Παραμένουν κληρώσιμοι) ---
  {
    name: "Vassilis Spanoulis",
    career: [ { team: "Maroussi", years: "2001-2005" }, { team: "Panathinaikos", years: "2005-2006" }, { team: "Houston Rockets (NBA)", years: "2006-2007" }, { team: "Panathinaikos", years: "2007-2010" }, { team: "Olympiacos", years: "2010-2021" } ],
    hints: { jersey: "#7", position: "SG", nationality: "Greece" }
  },
  {
    name: "Dimitris Diamantidis",
    career: [ { team: "Iraklis", years: "1999-2004" }, { team: "Panathinaikos", years: "2004-2016" } ],
    hints: { jersey: "#13", position: "PG", nationality: "Greece" }
  },
  {
    name: "Juan Carlos Navarro",
    career: [ { team: "Barcelona", years: "1997-2007" }, { team: "Memphis Grizzlies (NBA)", years: "2007-2008" }, { team: "Barcelona", years: "2008-2018" } ],
    hints: { jersey: "#11", position: "SG", nationality: "Spain" }
  },
  {
    name: "Sarunas Jasikevicius",
    career: [ { team: "Barcelona", years: "2000-2003" }, { team: "Maccabi Tel Aviv", years: "2003-2005" }, { team: "Indiana / Golden State (NBA)", years: "2005-2007" }, { team: "Panathinaikos", years: "2007-2010" }, { team: "Zalgiris Kaunas", years: "2013-2014" } ],
    hints: { jersey: "#13", position: "PG", nationality: "Lithuania" }
  },
  {
    name: "Kyle Hines",
    career: [ { team: "Brose Bamberg", years: "2010-2011" }, { team: "Olympiacos", years: "2011-2013" }, { team: "CSKA Moscow", years: "2013-2020" }, { team: "Olimpia Milano", years: "2020-2024" } ],
    hints: { jersey: "#42", position: "C", nationality: "USA" }
  },
  {
    name: "Nando De Colo",
    career: [ { team: "Valencia", years: "2009-2012" }, { team: "San Antonio / Toronto (NBA)", years: "2012-2014" }, { team: "CSKA Moscow", years: "2014-2019" }, { team: "Fenerbahce", years: "2019-2022" }, { team: "ASVEL", years: "2022-Present" } ],
    hints: { jersey: "#1", position: "SG", nationality: "France" }
  },
  {
    name: "Sergio Llull",
    career: [ { team: "Manresa", years: "2005-2007" }, { team: "Real Madrid", years: "2007-Present" } ],
    hints: { jersey: "#23", position: "PG", nationality: "Spain" }
  },
  {
    name: "Milos Teodosic",
    career: [ { team: "Olympiacos", years: "2007-2011" }, { team: "CSKA Moscow", years: "2011-2017" }, { team: "LA Clippers (NBA)", years: "2017-2019" }, { team: "Virtus Bologna", years: "2019-2023" }, { team: "Crvena Zvezda", years: "2023-Present" } ],
    hints: { jersey: "#4", position: "PG", nationality: "Serbia" }
  },
  {
    name: "Theo Papaloukas",
    career: [ { team: "Panionios", years: "1999-2001" }, { team: "Olympiacos", years: "2001-2002" }, { team: "CSKA Moscow", years: "2002-2008" }, { team: "Olympiacos", years: "2008-2011" }, { team: "Maccabi Tel Aviv", years: "2011-2012" }, { team: "CSKA Moscow", years: "2012-2013" } ],
    hints: { jersey: "#4", position: "PG", nationality: "Greece" }
  },
  {
    name: "Dejan Bodiroga",
    career: [ { team: "Olimpia Milano", years: "1994-1996" }, { team: "Real Madrid", years: "1996-1998" }, { team: "Panathinaikos", years: "1998-2002" }, { team: "Barcelona", years: "2002-2005" }, { team: "Virtus Roma", years: "2005-2007" } ],
    hints: { jersey: "#10", position: "SF", nationality: "Serbia" }
  },
  {
    name: "Ramunas Siskauskas",
    career: [ { team: "Lietuvos Rytas", years: "1998-2004" }, { team: "Benetton Treviso", years: "2004-2006" }, { team: "Panathinaikos", years: "2006-2007" }, { team: "CSKA Moscow", years: "2007-2012" } ],
    hints: { jersey: "#9", position: "SF", nationality: "Lithuania" }
  },
  {
    name: "Mike Batiste",
    career: [ { team: "Spirou Charleroi", years: "2000-2001" }, { team: "Memphis Grizzlies (NBA)", years: "2002-2003" }, { team: "Panathinaikos", years: "2003-2012" }, { team: "Fenerbahce", years: "2012-2013" }, { team: "Panathinaikos", years: "2013-2014" } ],
    hints: { jersey: "#8", position: "C", nationality: "USA" }
  },
  {
    name: "Nikola Vujcic",
    career: [ { team: "Split", years: "1995-2001" }, { team: "ASVEL", years: "2001-2002" }, { team: "Maccabi Tel Aviv", years: "2002-2008" }, { team: "Olympiacos", years: "2008-2010" }, { team: "Anadolu Efes", years: "2010-2011" } ],
    hints: { jersey: "#7", position: "C", nationality: "Croatia" }
  },
  {
    name: "J.R. Holden",
    career: [ { team: "Oostende", years: "2000-2001" }, { team: "AEK Athens", years: "2001-2002" }, { team: "CSKA Moscow", years: "2002-2011" } ],
    hints: { jersey: "#10", position: "PG", nationality: "USA / Russia" }
  },
  {
    name: "Victor Khryapa",
    career: [ { team: "CSKA Moscow", years: "2002-2004" }, { team: "Portland / Chicago (NBA)", years: "2004-2008" }, { team: "CSKA Moscow", years: "2008-2018" } ],
    hints: { jersey: "#31", position: "PF", nationality: "Russia" }
  },
  {
    name: "Felipe Reyes",
    career: [ { team: "Estudiantes", years: "1998-2004" }, { team: "Real Madrid", years: "2004-2021" } ],
    hints: { jersey: "#9", position: "PF", nationality: "Spain" }
  },
  {
    name: "Ioannis Bourousis",
    career: [ { team: "AEK Athens", years: "2001-2006" }, { team: "Olympiacos", years: "2006-2011" }, { team: "Olimpia Milano", years: "2011-2013" }, { team: "Real Madrid", years: "2013-2015" }, { team: "Baskonia", years: "2015-2016" }, { team: "Panathinaikos", years: "2016-2017" } ],
    hints: { jersey: "#9", position: "C", nationality: "Greece" }
  },
  {
    name: "Nick Calathes",
    career: [ { team: "Panathinaikos", years: "2009-2012" }, { team: "Lokomotiv Kuban", years: "2012-2013" }, { team: "Memphis Grizzlies (NBA)", years: "2013-2015" }, { team: "Panathinaikos", years: "2015-2020" }, { team: "Barcelona", years: "2020-2022" }, { team: "Fenerbahce", years: "2022-2024" }, { team: "AS Monaco", years: "2024-Present" } ],
    hints: { jersey: "#8", position: "PG", nationality: "Greece" }
  },
  {
    name: "Vasilije Micic",
    career: [ { team: "Bayern Munich", years: "2014-2016" }, { team: "Crvena Zvezda", years: "2015-2016" }, { team: "Zalgiris Kaunas", years: "2017-2018" }, { team: "Anadolu Efes", years: "2018-2023" }, { team: "OKC / Charlotte (NBA)", years: "2023-Present" } ],
    hints: { jersey: "#22", position: "PG", nationality: "Serbia" }
  },
  {
    name: "Bogdan Bogdanovic",
    career: [ { team: "Partizan", years: "2010-2014" }, { team: "Fenerbahce", years: "2014-2017" }, { team: "Sacramento / Atlanta (NBA)", years: "2017-Present" } ],
    hints: { jersey: "#13", position: "SG", nationality: "Serbia" }
  },
  {
    name: "Gigi Datome",
    career: [ { team: "Siena / Scafati / Virtus Roma", years: "2003-2013" }, { team: "Detroit / Boston (NBA)", years: "2013-2015" }, { team: "Fenerbahce", years: "2015-2020" }, { team: "Olimpia Milano", years: "2020-2023" } ],
    hints: { jersey: "#70", position: "SF", nationality: "Italy" }
  },
  {
    name: "Cory Higgins",
    career: [ { team: "Charlotte Bobcats (NBA)", years: "2011-2012" }, { team: "Triumph Lyubertsy", years: "2013-2014" }, { team: "Gaziantep", years: "2014-2015" }, { team: "CSKA Moscow", years: "2015-2019" }, { team: "Barcelona", years: "2019-2023" } ],
    hints: { jersey: "#22", position: "SG", nationality: "USA" }
  },
  {
    name: "Sergio Rodriguez",
    career: [ { team: "Estudiantes", years: "2003-2006" }, { team: "Portland / Sac / NY (NBA)", years: "2006-2010" }, { team: "Real Madrid", years: "2010-2016" }, { team: "Philadelphia 76ers (NBA)", years: "2016-2017" }, { team: "CSKA Moscow", years: "2017-2019" }, { team: "Olimpia Milano", years: "2019-2022" }, { team: "Real Madrid", years: "2022-2024" } ],
    hints: { jersey: "#13", position: "PG", nationality: "Spain" }
  },
  {
    name: "Rudy Fernandez",
    career: [ { team: "Joventut Badalona", years: "2002-2008" }, { team: "Portland / Denver (NBA)", years: "2008-2012" }, { team: "Real Madrid", years: "2012-2024" } ],
    hints: { jersey: "#5", position: "SF", nationality: "Spain" }
  },
  {
    name: "Giorgos Printezis",
    career: [ { team: "Olympiacos", years: "2001-2009" }, { team: "Unicaja Malaga", years: "2009-2011" }, { team: "Olympiacos", years: "2011-2022" } ],
    hints: { jersey: "#15", position: "PF", nationality: "Greece" }
  },
  {
    name: "Kostas Papanikolaou",
    career: [ { team: "Aris", years: "2008-2009" }, { team: "Olympiacos", years: "2009-2013" }, { team: "Barcelona", years: "2013-2014" }, { team: "Houston / Denver (NBA)", years: "2014-2015" }, { team: "Olympiacos", years: "2016-Present" } ],
    hints: { jersey: "#16", position: "SF", nationality: "Greece" }
  },
  {
    name: "Ante Tomic",
    career: [ { team: "Zagreb", years: "2004-2010" }, { team: "Real Madrid", years: "2010-2012" }, { team: "Barcelona", years: "2012-2020" }, { team: "Joventut Badalona", years: "2020-Present" } ],
    hints: { jersey: "#44", position: "C", nationality: "Croatia" }
  },
  {
    name: "Tyler Dorsey",
    career: [ { team: "Atlanta / Memphis (NBA)", years: "2017-2019" }, { team: "Maccabi Tel Aviv", years: "2019-2021" }, { team: "Olympiacos", years: "2021-2022" }, { team: "Dallas Mavericks (NBA)", years: "2022-2023" }, { team: "Fenerbahce", years: "2023-2024" }, { team: "Olympiacos", years: "2024-Present" } ],
    hints: { jersey: "#2", position: "SG", nationality: "USA / Greece" }
  },

  // =========================================================================
  // --- GUESSABLE ONLY PLAYERS (Μόνο για την αναζήτηση - Δεν κληρώνονται) ---
  // =========================================================================

  // -- ΙΣΤΟΡΙΚΟΙ/ΠΡΩΗΝ LEGENDS & ΑΠΟΣΥΡΘΕΝΤΕΣ --
  {
    name: "Anthony Parker",
    career: [ { team: "Maccabi Tel Aviv", years: "2000-2002" }, { team: "Virtus Roma", years: "2002-2003" }, { team: "Maccabi Tel Aviv", years: "2003-2006" } ],
    hints: { jersey: "#8", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Igor Rakocevic",
    career: [ { team: "Buducnost", years: "1995-2000" }, { team: "Pamesa Valencia", years: "2003-2004" }, { team: "Real Madrid", years: "2005-2006" }, { team: "Baskonia", years: "2006-2009" }, { team: "Anadolu Efes", years: "2009-2011" }, { team: "Crvena Zvezda", years: "2012-2013" } ],
    hints: { jersey: "#8", position: "SG", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "Mirsad Turkcan",
    career: [ { team: "Efes Pilsen", years: "1993-1999" }, { team: "CSKA Moscow", years: "2001-2002" }, { team: "Montepaschi Siena", years: "2002-2003" }, { team: "CSKA Moscow", years: "2003-2004" }, { team: "Fenerbahce", years: "2006-2012" } ],
    hints: { jersey: "#6", position: "PF", nationality: "Turkey" },
    guessableOnly: true
  },
  {
    name: "Marcus Brown",
    career: [ { team: "Benetton Treviso", years: "2000-2001" }, { team: "Efes Pilsen", years: "2001-2003" }, { team: "CSKA Moscow", years: "2003-2005" }, { team: "Unicaja Malaga", years: "2005-2007" }, { team: "Zalgiris Kaunas", years: "2007-2011" } ],
    hints: { jersey: "#5", position: "SG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Matjaz Smodis",
    career: [ { team: "Virtus Bologna", years: "2000-2003" }, { team: "Fortitudo Bologna", years: "2003-2005" }, { team: "CSKA Moscow", years: "2005-2011" }, { team: "Cedevita", years: "2012-2013" } ],
    hints: { jersey: "#8", position: "PF", nationality: "Slovenia" },
    guessableOnly: true
  },
  {
    name: "Tyrese Rice",
    career: [ { team: "Artland Dragons", years: "2011-2012" }, { team: "Bayern Munich", years: "2012-2013" }, { team: "Maccabi Tel Aviv", years: "2013-2014" }, { team: "Khimki", years: "2014-2016" }, { team: "Barcelona", years: "2016-2017" }, { team: "Brose Bamberg", years: "2018" }, { team: "Panathinaikos", years: "2019-2020" } ],
    hints: { jersey: "#4", position: "PG", nationality: "USA / Montenegro" },
    guessableOnly: true
  },
  {
    name: "Jaka Lakovic",
    career: [ { team: "Krka", years: "1998-2002" }, { team: "Panathinaikos", years: "2002-2006" }, { team: "Barcelona", years: "2006-2011" }, { team: "Galatasaray", years: "2011-2013" }, { team: "Avellino", years: "2013-2014" } ],
    hints: { jersey: "#10", position: "PG", nationality: "Slovenia" },
    guessableOnly: true
  },
  {
    name: "Sofoklis Schortsanitis",
    career: [ { team: "Iraklis", years: "2000-2003" }, { team: "Cantù", years: "2003-2004" }, { team: "Olympiacos", years: "2005-2010" }, { team: "Maccabi Tel Aviv", years: "2010-2012" }, { team: "Panathinaikos", years: "2012-2013" }, { team: "Maccabi Tel Aviv", years: "2013-2015" }, { team: "Crvena Zvezda", years: "2015" } ],
    hints: { jersey: "#15", position: "C", nationality: "Greece" },
    guessableOnly: true
  },
  {
    name: "Gianluca Basile",
    career: [ { team: "Reggio Emilia", years: "1995-1999" }, { team: "Fortitudo Bologna", years: "1999-2005" }, { team: "Barcelona", years: "2005-2011" }, { team: "Cantù", years: "2011-2012" }, { team: "Olimpia Milano", years: "2012-2013" } ],
    hints: { jersey: "#5", position: "SG", nationality: "Italy" },
    guessableOnly: true
  },
  {
    name: "Pablo Prigioni",
    career: [ { team: "Fuenlabrada", years: "1999-2001" }, { team: "Alicante", years: "2001-2003" }, { team: "Baskonia", years: "2003-2009" }, { team: "Real Madrid", years: "2009-2011" }, { team: "Baskonia", years: "2011-2012" } ],
    hints: { jersey: "#5", position: "PG", nationality: "Argentina" },
    guessableOnly: true
  },
  {
    name: "Erazem Lorbek",
    career: [ { team: "Fortitudo Bologna", years: "2003-2006" }, { team: "Unicaja Malaga", years: "2006-2007" }, { team: "Benetton Treviso", years: "2007" }, { team: "Virtus Roma", years: "2007-2008" }, { team: "CSKA Moscow", years: "2008-2009" }, { team: "Barcelona", years: "2009-2014" } ],
    hints: { jersey: "#25", position: "PF", nationality: "Slovenia" },
    guessableOnly: true
  },
  {
    name: "Fragiskos Alvertis",
    career: [ { team: "Panathinaikos", years: "1990-2009" } ],
    hints: { jersey: "#4", position: "SF", nationality: "Greece" },
    guessableOnly: true
  },
  {
    name: "David Andersen",
    career: [ { team: "Virtus Bologna", years: "1999-2003" }, { team: "Montepaschi Siena", years: "2003-2004" }, { team: "CSKA Moscow", years: "2004-2008" }, { team: "Barcelona", years: "2008-2009" }, { team: "Montepaschi Siena", years: "2011-2012" }, { team: "Fenerbahce", years: "2012-2013" } ],
    hints: { jersey: "#12", position: "C", nationality: "Australia" },
    guessableOnly: true
  },
  {
    name: "Linas Kleiza",
    career: [ { team: "Olympiacos", years: "2009-2010" }, { team: "Fenerbahce", years: "2013-2014" }, { team: "Olimpia Milano", years: "2014-2015" } ],
    hints: { jersey: "#11", position: "PF", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Gustavo Ayon",
    career: [ { team: "Fuenlabrada", years: "2009-2011" }, { team: "Real Madrid", years: "2014-2019" }, { team: "Zenit St. Petersburg", years: "2019-2020" } ],
    hints: { jersey: "#14", position: "C", nationality: "Mexico" },
    guessableOnly: true
  },
  {
    name: "Andrei Kirilenko",
    career: [ { team: "CSKA Moscow", years: "1998-2001" }, { team: "CSKA Moscow", years: "2011-2012" }, { team: "CSKA Moscow", years: "2015" } ],
    hints: { jersey: "#47", position: "SF", nationality: "Russia" },
    guessableOnly: true
  },
  {
    name: "Arvydas Sabonis",
    career: [ { team: "Zalgiris Kaunas", years: "1981-1989" }, { team: "Real Madrid", years: "1992-1995" }, { team: "Portland Trail Blazers (NBA)", years: "1995-2003" }, { team: "Zalgiris Kaunas", years: "2003-2004" } ],
    hints: { jersey: "#11", position: "C", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Alphonso Ford",
    career: [ { team: "Peristeri", years: "1999-2001" }, { team: "Olympiacos", years: "2001-2002" }, { team: "Montepaschi Siena", years: "2002-2003" }, { team: "Scavolini Pesaro", years: "2003-2004" } ],
    hints: { jersey: "#10", position: "SG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Luis Scola",
    career: [ { team: "Baskonia", years: "1998-2007" }, { team: "Various Teams (NBA)", years: "2007-2017" }, { team: "Olimpia Milano", years: "2019-2020" }, { team: "Varese", years: "2020-2021" } ],
    hints: { jersey: "#4", position: "PF", nationality: "Argentina" },
    guessableOnly: true
  },
  {
    name: "Tiago Splitter",
    career: [ { team: "Baskonia", years: "2003-2010" }, { team: "San Antonio Spurs (NBA)", years: "2010-2015" }, { team: "Atlanta / Philly (NBA)", years: "2015-2017" } ],
    hints: { jersey: "#21", position: "C", nationality: "Brazil" },
    guessableOnly: true
  },
  {
    name: "Maceo Baston",
    career: [ { team: "Joventut Badalona", years: "2000-2002" }, { team: "Maccabi Tel Aviv", years: "2003-2006" }, { team: "Indiana / Toronto (NBA)", years: "2006-2009" }, { team: "Budivelnyk", years: "2010" } ],
    hints: { jersey: "#5", position: "PF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Pete Mickeal",
    career: [ { team: "Peristeri", years: "2003-2004" }, { team: "Dynamo Moscow", years: "2004-2005" }, { team: "Baskonia", years: "2007-2009" }, { team: "Barcelona", years: "2009-2013" } ],
    hints: { jersey: "#33", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Zeljko Rebraca",
    career: [ { team: "Partizan", years: "1991-1995" }, { team: "Benetton Treviso", years: "1995-1999" }, { team: "Panathinaikos", years: "1999-2001" }, { team: "Detroit / Atlanta / Clippers (NBA)", years: "2001-2006" }, { team: "Pamesa Valencia", years: "2007" } ],
    hints: { jersey: "#12", position: "C", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "Dejan Tomasevic",
    career: [ { team: "Partizan", years: "1995-1999" }, { team: "Buducnost", years: "1999-2001" }, { team: "Baskonia", years: "2001-2002" }, { team: "Valencia", years: "2002-2005" }, { team: "Panathinaikos", years: "2005-2008" }, { team: "PAOK", years: "2008-2009" } ],
    hints: { jersey: "#14", position: "C", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "Nikola Pekovic",
    career: [ { team: "Partizan", years: "2005-2008" }, { team: "Panathinaikos", years: "2008-2010" }, { team: "Minnesota Timberwolves (NBA)", years: "2010-2017" }, { team: "Partizan", years: "2011" } ],
    hints: { jersey: "#14", position: "C", nationality: "Montenegro" },
    guessableOnly: true
  },
  {
    name: "Stratos Perperoglou",
    career: [ { team: "Panionios", years: "2004-2007" }, { team: "Panathinaikos", years: "2007-2012" }, { team: "Olympiacos", years: "2012-2014" }, { team: "Anadolu Efes", years: "2014-2015" }, { team: "Barcelona", years: "2015-2016" }, { team: "Crvena Zvezda", years: "2018-2020" } ],
    hints: { jersey: "#33", position: "SF", nationality: "Greece" },
    guessableOnly: true
  },
  {
    name: "Jaycee Carroll",
    career: [ { team: "Teramo", years: "2008-2009" }, { team: "Gran Canaria", years: "2009-2011" }, { team: "Real Madrid", years: "2011-2021" } ],
    hints: { jersey: "#20", position: "SG", nationality: "USA / Azerbaijan" },
    guessableOnly: true
  },
  {
    name: "Chuck Eidson",
    career: [ { team: "Lietuvos Rytas", years: "2007-2009" }, { team: "Maccabi Tel Aviv", years: "2009-2011" }, { team: "Barcelona", years: "2011-2012" }, { team: "UNICS Kazan", years: "2012-2014" } ],
    hints: { jersey: "#13", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Jonas Maciulis",
    career: [ { team: "Zalgiris Kaunas", years: "2005-2009" }, { team: "Olimpia Milano", years: "2009-2011" }, { team: "Panathinaikos", years: "2012-2014" }, { team: "Real Madrid", years: "2014-2017" }, { team: "AEK Athens", years: "2018-2021" } ],
    hints: { jersey: "#8", position: "SF", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Bostjan Nachbar",
    career: [ { team: "Olimpija", years: "2000-2002" }, { team: "Houston / NO / NJ (NBA)", years: "2002-2008" }, { team: "Efes Pilsen", years: "2009-2011" }, { team: "Brose Bamberg", years: "2012-2013" }, { team: "Barcelona", years: "2013-2015" } ],
    hints: { jersey: "#7", position: "PF", nationality: "Slovenia" },
    guessableOnly: true
  },

  // -- ΔΙΕΘΝΕΙΣ JOURNEYMEN & CULT HEROES (ΜΗ ΕΝΕΡΓΟΙ ΣΤΗ ΕURΟLΕΑGUΕ) --
  {
    name: "Jaka Blazic",
    career: [ { team: "Olimpija", years: "2011-2013" }, { team: "Crvena Zvezda", years: "2013-2015" }, { team: "Baskonia", years: "2015-2017" }, { team: "Barcelona", years: "2018-2019" } ],
    hints: { jersey: "#11", position: "SG", nationality: "Slovenia" },
    guessableOnly: true
  },
  {
    name: "Kyle Kuric",
    career: [ { team: "Gran Canaria", years: "2014-2017" }, { team: "Zenit", years: "2017-2018" }, { team: "Barcelona", years: "2018-2023" }, { team: "Zenit", years: "2023-Present" } ],
    hints: { jersey: "#24", position: "SG", nationality: "USA / Slovakia" },
    guessableOnly: true
  },
  {
    name: "Pierre Oriola",
    career: [ { team: "Valencia", years: "2016-2017" }, { team: "Barcelona", years: "2017-2022" }, { team: "AEK Athens", years: "2023" } ],
    hints: { jersey: "#18", position: "PF", nationality: "Spain" },
    guessableOnly: true
  },
  {
    name: "Jeffery Taylor",
    career: [ { team: "Real Madrid", years: "2015-2022" }, { team: "Wolves", years: "2023-Present" } ],
    hints: { jersey: "#44", position: "SF", nationality: "Sweden / USA" },
    guessableOnly: true
  },
  {
    name: "Trey Thompkins",
    career: [ { team: "Nizhny Novgorod", years: "2014-2015" }, { team: "Real Madrid", years: "2015-2022" }, { team: "Zenit", years: "2022-2023" }, { team: "Crvena Zvezda", years: "2024" } ],
    hints: { jersey: "#33", position: "PF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Mindaugas Kuzminskas",
    career: [ { team: "Zalgiris Kaunas", years: "2010-2013" }, { team: "Unicaja Malaga", years: "2013-2016" }, { team: "Olimpia Milano", years: "2018-2019" }, { team: "Zenit", years: "2021-2022" }, { team: "AEK Athens", years: "2023-Present" } ],
    hints: { jersey: "#19", position: "SF", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Paul Zipser",
    career: [ { team: "Bayern Munich", years: "2013-2016" }, { team: "Chicago Bulls (NBA)", years: "2016-2018" }, { team: "Bayern Munich", years: "2019-2023" } ],
    hints: { jersey: "#16", position: "SF", nationality: "Germany" },
    guessableOnly: true
  },
  {
    name: "Peyton Siva",
    career: [ { team: "ALBA Berlin", years: "2016-2021" }, { team: "Panathinaikos", years: "2022" } ],
    hints: { jersey: "#3", position: "PG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Johannes Thiemann",
    career: [ { team: "Ludwigsburg", years: "2016-2018" }, { team: "ALBA Berlin", years: "2018-2024" }, { team: "Gunma Crane Thunders", years: "2024-Present" } ],
    hints: { jersey: "#32", position: "C", nationality: "Germany" },
    guessableOnly: true
  },
  {
    name: "Bojan Dubljevic",
    career: [ { team: "Buducnost", years: "2010-2012" }, { team: "Valencia", years: "2012-2023" }, { team: "Zenit", years: "2023-Present" } ],
    hints: { jersey: "#14", position: "C", nationality: "Montenegro" },
    guessableOnly: true
  },
  {
    name: "Sam Van Rossom",
    career: [ { team: "Scavolini Pesaro", years: "2008-2010" }, { team: "Zaragoza", years: "2010-2013" }, { team: "Valencia", years: "2013-2023" } ],
    hints: { jersey: "#9", position: "PG", nationality: "Belgium" },
    guessableOnly: true
  },
  {
    name: "Fran Vazquez",
    career: [ { team: "Unicaja Malaga", years: "2001-2005" }, { team: "Girona", years: "2005-2006" }, { team: "Barcelona", years: "2006-2012" }, { team: "Unicaja Malaga", years: "2012-2016" } ],
    hints: { jersey: "#17", position: "C", nationality: "Spain" },
    guessableOnly: true
  },
  {
    name: "Devin Smith",
    career: [ { team: "Fenerbahce", years: "2008-2009" }, { team: "Panellinios", years: "2009-2010" }, { team: "Benetton Treviso", years: "2010-2011" }, { team: "Maccabi Tel Aviv", years: "2011-2017" } ],
    hints: { jersey: "#6", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Guy Pnini",
    career: [ { team: "Bnei Herzliya", years: "2001-2006" }, { team: "Hapoel Jerusalem", years: "2006-2008" }, { team: "FMP", years: "2008-2009" }, { team: "Maccabi Tel Aviv", years: "2009-2017" } ],
    hints: { jersey: "#10", position: "SF", nationality: "Israel" },
    guessableOnly: true
  },
  {
    name: "Lior Eliyahu",
    career: [ { team: "Hapoel Galil Elyon", years: "2003-2006" }, { team: "Maccabi Tel Aviv", years: "2006-2009" }, { team: "Baskonia", years: "2009-2010" }, { team: "Maccabi Tel Aviv", years: "2010-2013" }, { team: "Hapoel Jerusalem", years: "2013-2019" } ],
    hints: { jersey: "#8", position: "PF", nationality: "Israel" },
    guessableOnly: true
  },
  {
    name: "Marcelinho Huertas",
    career: [ { team: "Joventut Badalona", years: "2004-2007" }, { team: "Baskonia", years: "2009-2011" }, { team: "Barcelona", years: "2011-2015" }, { team: "LA Lakers (NBA)", years: "2015-2017" }, { team: "Baskonia", years: "2017-2019" }, { team: "Tenerife", years: "2019-Present" } ],
    hints: { jersey: "#9", position: "PG", nationality: "Brazil" },
    guessableOnly: true
  },
  {
    name: "Brad Oleson",
    career: [ { team: "Fuenlabrada", years: "2008-2009" }, { team: "Baskonia", years: "2009-2013" }, { team: "Barcelona", years: "2013-2017" }, { team: "UCAM Murcia", years: "2017-2019" } ],
    hints: { jersey: "#24", position: "SG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Mirza Teletovic",
    career: [ { team: "Oostende", years: "2005-2006" }, { team: "Baskonia", years: "2006-2012" }, { team: "Brooklyn / Phoenix / Bucks (NBA)", years: "2012-2018" } ],
    hints: { jersey: "#33", position: "PF", nationality: "Bosnia and Herzegovina" },
    guessableOnly: true
  },
  {
    name: "D'or Fischer",
    career: [ { team: "Bree", years: "2007-2008" }, { team: "Maccabi Tel Aviv", years: "2008-2010" }, { team: "Real Madrid", years: "2010-2011" }, { team: "Bilbao", years: "2011-2012" }, { team: "Brose Bamberg", years: "2013-2014" }, { team: "UNICS Kazan", years: "2014-2015" } ],
    hints: { jersey: "#40", position: "C", nationality: "USA / Israel" },
    guessableOnly: true
  },
  {
    name: "Anton Gavel",
    career: [ { team: "Giessen", years: "2004-2006" }, { team: "Murcia", years: "2006-2008" }, { team: "Brose Bamberg", years: "2009-2014" }, { team: "Bayern Munich", years: "2014-2018" } ],
    hints: { jersey: "#25", position: "SG", nationality: "Slovakia / Germany" },
    guessableOnly: true
  },
  {
    name: "Carlos Arroyo",
    career: [ { team: "Baskonia", years: "2001-2002" }, { team: "Various Teams (NBA)", years: "2001-2008" }, { team: "Maccabi Tel Aviv", years: "2008-2009" }, { team: "Galatasaray", years: "2013-2015" }, { team: "Barcelona", years: "2015-2016" } ],
    hints: { jersey: "#30", position: "PG", nationality: "Puerto Rico" },
    guessableOnly: true
  },
  {
    name: "Fernando San Emeterio",
    career: [ { team: "Valladolid", years: "2001-2006" }, { team: "Girona", years: "2006-2008" }, { team: "Baskonia", years: "2008-2015" }, { team: "Valencia", years: "2015-2021" } ],
    hints: { jersey: "#19", position: "SF", nationality: "Spain" },
    guessableOnly: true
  },
  {
    name: "Victor Claver",
    career: [ { team: "Valencia", years: "2006-2012" }, { team: "Portland Trail Blazers (NBA)", years: "2012-2015" }, { team: "Lokomotiv Kuban", years: "2015-2016" }, { team: "Barcelona", years: "2016-2021" }, { team: "Valencia", years: "2021-2024" } ],
    hints: { jersey: "#10", position: "PF", nationality: "Spain" },
    guessableOnly: true
  },
  {
    name: "Emir Preldzic",
    career: [ { team: "Slovan", years: "2005-2007" }, { team: "Fenerbahce", years: "2007-2015" }, { team: "Darussafaka", years: "2015-2016" }, { team: "Galatasaray", years: "2016-2018" } ],
    hints: { jersey: "#55", position: "SF", nationality: "Turkey / Slovenia" },
    guessableOnly: true
  },
  {
    name: "Kerem Tunceri",
    career: [ { team: "Galatasaray", years: "1997-1999" }, { team: "Efes Pilsen", years: "1999-2004" }, { team: "Real Madrid", years: "2006-2008" }, { team: "Efes Pilsen", years: "2008-2013" } ],
    hints: { jersey: "#9", position: "PG", nationality: "Turkey" },
    guessableOnly: true
  },
  {
    name: "Marcus Slaughter",
    career: [ { team: "Pinar Karsiyaka", years: "2007-2008" }, { team: "Brose Bamberg", years: "2011-2012" }, { team: "Real Madrid", years: "2012-2015" }, { team: "Darussafaka", years: "2015-2017" }, { team: "AEK Athens", years: "2019-2021" } ],
    hints: { jersey: "#44", position: "C", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Maciej Lampe",
    career: [ { team: "Real Madrid", years: "2001-2003" }, { team: "Khimki", years: "2007-2009" }, { team: "Maccabi Tel Aviv", years: "2009-2010" }, { team: "Baskonia", years: "2011-2013" }, { team: "Barcelona", years: "2013-2015" } ],
    hints: { jersey: "#30", position: "C", nationality: "Poland / Sweden" },
    guessableOnly: true
  },
  {
    name: "Nemanja Bjelica",
    career: [ { team: "Crvena Zvezda", years: "2008-2010" }, { team: "Baskonia", years: "2010-2013" }, { team: "Fenerbahce", years: "2013-2015" }, { team: "Various Teams (NBA)", years: "2015-2022" }, { team: "Fenerbahce", years: "2022-2023" } ],
    hints: { jersey: "#8", position: "PF", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "Alex Tyus",
    career: [ { team: "Maccabi Tel Aviv", years: "2013-2015" }, { team: "Anadolu Efes", years: "2015-2016" }, { team: "Galatasaray", years: "2016-2017" }, { team: "Maccabi Tel Aviv", years: "2017-2019" }, { team: "Real Madrid", years: "2021" }, { team: "ASVEL", years: "2022-2023" } ],
    hints: { jersey: "#9", position: "C", nationality: "USA / Israel" },
    guessableOnly: true
  },
  {
    name: "Paulius Jankunas",
    career: [ { team: "Zalgiris Kaunas", years: "2003-2009" }, { team: "Khimki", years: "2009-2010" }, { team: "Zalgiris Kaunas", years: "2010-2022" } ],
    hints: { jersey: "#13", position: "PF", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Taylor Rochestie",
    career: [ { team: "Nizhny Novgorod", years: "2014-2015" }, { team: "Maccabi Tel Aviv", years: "2015-2016" }, { team: "Crvena Zvezda", years: "2017-2018" }, { team: "Olympiacos", years: "2019-2020" } ],
    hints: { jersey: "#22", position: "PG", nationality: "USA / Montenegro" },
    guessableOnly: true
  },
  {
    name: "Justin Doellman",
    career: [ { team: "Orleans", years: "2008-2010" }, { team: "Alicante / Valencia", years: "2010-2014" }, { team: "Barcelona", years: "2014-2017" }, { team: "Anadolu Efes", years: "2017" } ],
    hints: { jersey: "#5", position: "PF", nationality: "USA / Kosovo" },
    guessableOnly: true
  },
  {
    name: "Richard Hendrix",
    career: [ { team: "Maccabi Tel Aviv", years: "2010-2012" }, { team: "Olimpia Milano", years: "2012-2013" }, { team: "Lokomotiv Kuban", years: "2013-2015" }, { team: "Unicaja Malaga", years: "2015-2016" } ],
    hints: { jersey: "#7", position: "C", nationality: "USA / Macedonia" },
    guessableOnly: true
  },
  {
    name: "Jamon Gordon",
    career: [ { team: "Maroussi", years: "2009" }, { team: "Olympiacos", years: "2010-2011" }, { team: "Galatasaray", years: "2011-2012" }, { team: "Anadolu Efes", years: "2012-2014" }, { team: "Darussafaka", years: "2014-2016" } ],
    hints: { jersey: "#8", position: "PG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Tremmell Darden",
    career: [ { team: "Unicaja Malaga", years: "2011-2013" }, { team: "Zalgiris Kaunas", years: "2013" }, { team: "Real Madrid", years: "2013-2014" }, { team: "Olympiacos", years: "2014-2015" } ],
    hints: { jersey: "#21", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Oliver Lafayette",
    career: [ { team: "Asseco Prokom", years: "2011" }, { team: "Anadolu Efes", years: "2012" }, { team: "Valencia", years: "2013-2014" }, { team: "Olympiacos", years: "2014-2015" }, { team: "Olimpia Milano", years: "2015-2016" } ],
    hints: { jersey: "#20", position: "PG", nationality: "USA / Croatia" },
    guessableOnly: true
  },
  {
    name: "Blake Schilb",
    career: [ { team: "Chalon", years: "2007-2013" }, { team: "Crvena Zvezda", years: "2013-2014" }, { team: "Paris Levallois", years: "2014-2015" }, { team: "Galatasaray", years: "2015-2017" } ],
    hints: { jersey: "#11", position: "SF", nationality: "USA / Czech Republic" },
    guessableOnly: true
  },
  {
    name: "Malik Hairston",
    career: [ { team: "Montepaschi Siena", years: "2010-2011" }, { team: "Olimpia Milano", years: "2011-2013" }, { team: "Galatasaray", years: "2013-2014" } ],
    hints: { jersey: "#7", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Colton Iverson",
    career: [ { team: "Baskonia", years: "2014-2015" }, { team: "Maccabi Tel Aviv", years: "2016-2017" }, { team: "Zenit", years: "2019-2020" } ],
    hints: { jersey: "#45", position: "C", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Semih Erden",
    career: [ { team: "Partizan", years: "2004-2005" }, { team: "Fenerbahce", years: "2005-2010" }, { team: "Anadolu Efes", years: "2012-2014" }, { team: "Fenerbahce", years: "2014-2015" }, { team: "Darussafaka", years: "2015-2017" } ],
    hints: { jersey: "#9", position: "C", nationality: "Turkey" },
    guessableOnly: true
  },
  {
    name: "Ender Arslan",
    career: [ { team: "Efes Pilsen", years: "2000-2006" }, { team: "Olimpija / Baskonia / Panionios", years: "2006-2007" }, { team: "Efes Pilsen", years: "2007-2011" }, { team: "Galatasaray", years: "2011-2015" }, { team: "Darussafaka", years: "2015-2017" } ],
    hints: { jersey: "#10", position: "PG", nationality: "Turkey" },
    guessableOnly: true
  },
  {
    name: "Arturas Milaknis",
    career: [ { team: "Zalgiris Kaunas", years: "2007-2011" }, { team: "Zalgiris Kaunas", years: "2013-2015" }, { team: "UNICS Kazan", years: "2015-2016" }, { team: "Zalgiris Kaunas", years: "2016-2022" } ],
    hints: { jersey: "#21", position: "SG", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Leo Westermann",
    career: [ { team: "Partizan", years: "2012-2014" }, { team: "Limoges", years: "2014-2016" }, { team: "Zalgiris Kaunas", years: "2016-2017" }, { team: "CSKA Moscow", years: "2017-2018" }, { team: "Zalgiris Kaunas", years: "2018-2019" }, { team: "Fenerbahce", years: "2019-2020" }, { team: "Barcelona", years: "2021" }, { team: "AS Monaco", years: "2021-2022" } ],
    hints: { jersey: "#9", position: "PG", nationality: "France" },
    guessableOnly: true
  },
  {
    name: "Luke Sikma",
    career: [ { team: "Valencia", years: "2015-2017" }, { team: "ALBA Berlin", years: "2017-2023" }, { team: "Olympiacos", years: "2023-2024" } ],
    hints: { jersey: "#43", position: "PF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Howard Sant-Roos",
    career: [ { team: "Nymburk", years: "2015-2017" }, { team: "CSKA Moscow", years: "2020" }, { team: "Panathinaikos", years: "2020-2022" } ],
    hints: { jersey: "#77", position: "SF", nationality: "Cuba" },
    guessableOnly: true
  },
  {
    name: "Vladimir Stimac",
    career: [ { team: "Zalgiris Kaunas", years: "2007-2008" }, { team: "Unicaja Malaga", years: "2013-2014" }, { team: "Bayern Munich", years: "2014-2015" }, { team: "Crvena Zvezda", years: "2015-2016" }, { team: "Anadolu Efes", years: "2017-2018" }, { team: "Fenerbahce", years: "2019" } ],
    hints: { jersey: "#15", position: "C", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "Nate Wolters",
    career: [ { team: "Crvena Zvezda", years: "2016-2017" }, { team: "Zalgiris Kaunas", years: "2018-2019" }, { team: "Maccabi Tel Aviv", years: "2019-2020" }, { team: "Crvena Zvezda", years: "2021-2022" }, { team: "Panathinaikos", years: "2022-2023" } ],
    hints: { jersey: "#3", position: "PG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Leon Radosevic",
    career: [ { team: "Cibona", years: "2009-2011" }, { team: "Olimpia Milano", years: "2011-2013" }, { team: "ALBA Berlin", years: "2013-2015" }, { team: "Brose Bamberg", years: "2015-2018" }, { team: "Bayern Munich", years: "2018-2022" } ],
    hints: { jersey: "#43", position: "C", nationality: "Croatia / Germany" },
    guessableOnly: true
  },
  {
    name: "Ricky Hickman",
    career: [ { team: "Scavolini Pesaro", years: "2011-2012" }, { team: "Maccabi Tel Aviv", years: "2012-2014" }, { team: "Fenerbahce", years: "2014-2016" }, { team: "Olimpia Milano", years: "2016-2017" }, { team: "Brose Bamberg", years: "2017-2019" } ],
    hints: { jersey: "#4", position: "SG", nationality: "USA / Georgia" },
    guessableOnly: true
  },
  {
    name: "Zoran Dragic",
    career: [ { team: "Unicaja Malaga", years: "2012-2014" }, { team: "Khimki", years: "2015-2016" }, { team: "Olimpia Milano", years: "2016-2017" }, { team: "Anadolu Efes", years: "2017-2018" }, { team: "Baskonia", years: "2020-2021" }, { team: "Zalgiris Kaunas", years: "2021-2022" } ],
    hints: { jersey: "#30", position: "SG", nationality: "Slovenia" },
    guessableOnly: true
  },
  {
    name: "Derrick Brown",
    career: [ { team: "Lokomotiv Kuban", years: "2012-2015" }, { team: "Anadolu Efes", years: "2015-2018" }, { team: "Crvena Zvezda", years: "2019-2020" } ],
    hints: { jersey: "#2", position: "PF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Brock Motum",
    career: [ { team: "Zalgiris Kaunas", years: "2015-2017" }, { team: "Anadolu Efes", years: "2017-2019" }, { team: "Valencia", years: "2019-2020" }, { team: "Galatasaray", years: "2020-2021" }, { team: "AS Monaco", years: "2021-2022" } ],
    hints: { jersey: "#12", position: "PF", nationality: "Australia" },
    guessableOnly: true
  },
  {
    name: "James Nunnally",
    career: [ { team: "Fenerbahce", years: "2016-2018" }, { team: "Olimpia Milano", years: "2018-2019" }, { team: "Fenerbahce", years: "2020" }, { team: "Maccabi Tel Aviv", years: "2021-2022" }, { team: "Partizan", years: "2022-2024" } ],
    hints: { jersey: "#21", position: "SF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Ian Vougioukas",
    career: [ { team: "Panathinaikos", years: "2010-2012" }, { team: "UNICS Kazan", years: "2012-2014" }, { team: "Galatasaray", years: "2014-2015" }, { team: "Zalgiris Kaunas", years: "2015-2016" }, { team: "Lokomotiv Kuban", years: "2016-2017" }, { team: "Panathinaikos", years: "2017-2021" } ],
    hints: { jersey: "#14", position: "C", nationality: "Greece" },
    guessableOnly: true
  },
  {
    name: "Michael Roll",
    career: [ { team: "Maccabi Tel Aviv", years: "2017-2019" }, { team: "Olimpia Milano", years: "2019-2021" }, { team: "Pinar Karsiyaka", years: "2021-2022" } ],
    hints: { jersey: "#20", position: "SG", nationality: "USA / Tunisia" },
    guessableOnly: true
  },
  {
    name: "Jon Diebler",
    career: [ { team: "Panionios", years: "2011-2012" }, { team: "Pinar Karsiyaka", years: "2012-2015" }, { team: "Anadolu Efes", years: "2015-2016" }, { team: "Galatasaray", years: "2016-2017" }, { team: "Darussafaka", years: "2018-2019" } ],
    hints: { jersey: "#33", position: "SG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Jamel McLean",
    career: [ { team: "ALBA Berlin", years: "2014-2015" }, { team: "Olimpia Milano", years: "2015-2017" }, { team: "Olympiacos", years: "2017-2018" }, { team: "Lokomotiv Kuban", years: "2018-2019" } ],
    hints: { jersey: "#1", position: "C", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Arturas Gudaitis",
    career: [ { team: "Zalgiris Kaunas", years: "2013-2015" }, { team: "Lietuvos Rytas", years: "2015-2017" }, { team: "Olimpia Milano", years: "2017-2020" }, { team: "Zenit", years: "2020-2022" }, { team: "Panathinaikos", years: "2022-2023" } ],
    hints: { jersey: "#77", position: "C", nationality: "Lithuania" },
    guessableOnly: true
  },
  {
    name: "Kaleb Tarczewski",
    career: [ { team: "Olimpia Milano", years: "2017-2022" } ],
    hints: { jersey: "#15", position: "C", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Shelvin Mack",
    career: [ { team: "Various Teams (NBA)", years: "2011-2019" }, { team: "Olimpia Milano", years: "2019-2020" }, { team: "Panathinaikos", years: "2020-2021" } ],
    hints: { jersey: "#8", position: "PG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Krunoslav Simon",
    career: [ { team: "Zagreb", years: "2002-2012" }, { team: "Unicaja Malaga", years: "2012-2013" }, { team: "Lokomotiv Kuban", years: "2013-2014" }, { team: "Olimpia Milano", years: "2015-2017" }, { team: "Anadolu Efes", years: "2017-2022" } ],
    hints: { jersey: "#44", position: "SG", nationality: "Croatia" },
    guessableOnly: true
  },
  {
    name: "Vladimir Micov",
    career: [ { team: "Baskonia", years: "2009-2010" }, { team: "Cantù", years: "2010-2012" }, { team: "CSKA Moscow", years: "2012-2014" }, { team: "Galatasaray", years: "2014-2017" }, { team: "Olimpia Milano", years: "2017-2021" }, { team: "Buducnost", years: "2021-2022" } ],
    hints: { jersey: "#99", position: "SF", nationality: "Serbia" },
    guessableOnly: true
  },
  {
    name: "James Gist",
    career: [ { team: "Partizan", years: "2010-2011" }, { team: "Fenerbahce", years: "2011-2012" }, { team: "Unicaja Malaga", years: "2012" }, { team: "Panathinaikos", years: "2012-2019" }, { team: "Crvena Zvezda", years: "2019-2020" }, { team: "Bayern Munich", years: "2020-2021" }, { team: "ASVEL", years: "2021-2022" } ],
    hints: { jersey: "#14", position: "PF", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Othello Hunter",
    career: [ { team: "Siena", years: "2013-2014" }, { team: "Olympiacos", years: "2014-2016" }, { team: "Real Madrid", years: "2016-2017" }, { team: "CSKA Moscow", years: "2017-2019" }, { team: "Maccabi Tel Aviv", years: "2019-2021" }, { team: "Bayern Munich", years: "2021-2023" } ],
    hints: { jersey: "#5", position: "C", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Charles Jenkins",
    career: [ { team: "Crvena Zvezda", years: "2013-2015" }, { team: "Olimpia Milano", years: "2015-2016" }, { team: "Crvena Zvezda", years: "2016-2017" }, { team: "Khimki", years: "2017-2019" }, { team: "Crvena Zvezda", years: "2019-2020" }, { team: "Olympiacos", years: "2020-2021" } ],
    hints: { jersey: "#22", position: "SG", nationality: "USA / Serbia" },
    guessableOnly: true
  },
  {
    name: "K.C. Rivers",
    career: [ { team: "Khimki", years: "2012-2013" }, { team: "Real Madrid", years: "2014-2015" }, { team: "Bayern Munich", years: "2015" }, { team: "Panathinaikos", years: "2015-2018" }, { team: "Zalgiris Kaunas", years: "2019-2020" }, { team: "Zenit", years: "2020-2021" } ],
    hints: { jersey: "#0", position: "SG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Adam Hanga",
    career: [ { team: "Baskonia", years: "2013-2017" }, { team: "Barcelona", years: "2017-2021" }, { team: "Real Madrid", years: "2021-2023" }, { team: "Crvena Zvezda", years: "2023-2024" }, { team: "Joventut Badalona", years: "2024-Present" } ],
    hints: { jersey: "#8", position: "SF", nationality: "Hungary" },
    guessableOnly: true
  },
  {
    name: "Tibor Pleiss",
    career: [ { team: "Brose Bamberg", years: "2009-2012" }, { team: "Baskonia", years: "2012-2014" }, { team: "Barcelona", years: "2014-2015" }, { team: "Galatasaray", years: "2016-2017" }, { team: "Anadolu Efes", years: "2018-2024" }, { team: "Trapani", years: "2024-Present" } ],
    hints: { jersey: "#21", position: "C", nationality: "Germany" },
    guessableOnly: true
  },
  {
    name: "Nihad Dedovic",
    career: [ { team: "Barcelona", years: "2007-2012" }, { team: "Virtus Roma", years: "2012" }, { team: "Galatasaray", years: "2012" }, { team: "ALBA Berlin", years: "2012-2013" }, { team: "Bayern Munich", years: "2013-2022" }, { team: "Unicaja Malaga", years: "2022-Present" } ],
    hints: { jersey: "#14", position: "SG", nationality: "Bosnia and Herzegovina" },
    guessableOnly: true
  },
  {
    name: "Will Thomas",
    career: [ { team: "Unicaja Malaga", years: "2014-2016" }, { team: "Valencia", years: "2016-2019" }, { team: "Zenit", years: "2019-2021" }, { team: "AS Monaco", years: "2021-2022" }, { team: "Unicaja Malaga", years: "2022-2024" } ],
    hints: { jersey: "#10", position: "PF", nationality: "USA / Georgia" },
    guessableOnly: true
  },
  {
    name: "Aaron Jackson",
    career: [ { team: "Bilbao", years: "2010-2012" }, { team: "CSKA Moscow", years: "2012-2017" }, { team: "Maccabi Tel Aviv", years: "2019-2020" } ],
    hints: { jersey: "#9", position: "PG", nationality: "USA" },
    guessableOnly: true
  },
  {
    name: "Jayson Granger",
    career: [ { team: "Estudiantes", years: "2005-2013" }, { team: "Unicaja Malaga", years: "2013-2015" }, { team: "Anadolu Efes", years: "2015-2017" }, { team: "Baskonia", years: "2017-2020" }, { team: "ALBA Berlin", years: "2020-2021" }, { team: "Baskonia", years: "2021-2022" } ],
    hints: { jersey: "#15", position: "PG", nationality: "Uruguay" },
    guessableOnly: true
  },
  {
    name: "Janis Strelnieks",
    career: [ { team: "Budivelnyk", years: "2013-2014" }, { team: "Brose Bamberg", years: "2014-2017" }, { team: "Olympiacos", years: "2017-2019" }, { team: "CSKA Moscow", years: "2019-2021" }, { team: "Zalgiris Kaunas", years: "2021-2022" }, { team: "AEK Athens", years: "2022-2023" } ],
    hints: { jersey: "#13", position: "PG", nationality: "Latvia" },
    guessableOnly: true
  },
  {
    name: "DeShaun Thomas",
    career: [ { team: "Nanterre", years: "2013-2014" }, { team: "Barcelona", years: "2014-2015" }, { team: "Anadolu Efes", years: "2016-2017" }, { team: "Maccabi Tel Aviv", years: "2017-2018" }, { team: "Panathinaikos", years: "2018-2020" }, { team: "Bayern Munich", years: "2021-2022" }, { team: "Olimpia Milano", years: "2022-2023" } ],
    hints: { jersey: "#1", position: "PF", nationality: "USA" },
    guessableOnly: true
  }
];

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return NextResponse.json({ error: "No MongoDB URI" }, { status: 500 });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }

    // Καθαρισμός συλλογής
    await PlayerIdGame.deleteMany({});

    // Εισαγωγή φιλτραρισμένων δεδομένων
    const inserted = await PlayerIdGame.insertMany(PLAYERS_TO_INSERT);

    return NextResponse.json({
      success: true,
      message: `Επιτυχία! Εισήχθησαν ${inserted.length} φιλτραρισμένοι παίκτες στη βάση του Player ID.`,
      count: inserted.length
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}