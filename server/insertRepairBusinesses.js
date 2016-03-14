use 419
db.Businesses.insert ([
  {
    "latitude": 44.58575233,
    "longitude": -123.2563977,
    "name": "Bellevue Computers",
    "address": "1865 NW 9th St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97330,
    "phone": "541-757-3487",
    "url": "http://www.bellevuepc.com/",
    "notes": "repair computers and laptops"
  },
  {
    "latitude": 44.63290758,
    "longitude": -123.0837,
    "name": "Geeks 'N' Nerds",
    "address": "950 Southeast Geary St Unit D",
    "city": "Albany",
    "state": "OR",
    "zip": 97321,
    "phone": "(541) 753-0018",
    "url": "http://www.computergeeksnnerds.com/",
    "notes": "repair Computers of all kinds and cell phone repair; in home repair available"
  },
  {
    "latitude": 44.58868418,
    "longitude": -123.2610525,
    "name": "Covallis Technical",
    "address": "966 NW Circle Blvd",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97330,
    "phone": "(541) 704-7009",
    "url": "http://www.corvallistechnical.com/",
    "notes": "repair Computers and laptops"
  },
  {
    "latitude": 44.59007083,
    "longitude": -123.2541219,
    "name": "Foam Man",
    "address": "2511 NW 9th St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97330,
    "phone": "(541) 754-9378",
    "url": "http://www.thefoammancorvallis.com/",
    "notes": "Replacement foam cusions for chairs and couches; upholstery"
  },
  {
    "latitude": 44.62502034,
    "longitude": -123.2425419,
    "name": "P.K Furniture Repair & Refinishing",
    "address": "5270 NW Hwy 99",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97330,
    "phone": "541-230-1727",
    "url": "http://www.pkfurniturerefinishing.net/",
    "notes": "Complete Restoration, Complete Refinishing, Modifications, Custom Color Matching, Furniture Stripping,Chair Press Caning, Repairs"
  },
  {
    "latitude": 44.5889,
    "longitude": -123.2501135,
    "name": "Power equipment",
    "address": "713 NE Circle Blvd",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97330,
    "phone": "(541) 757-8075",
    "url": "https://corvallispowerequipment.stihldealer.net/",
    "notes": "lawn and garden equipment, chain saws (Stihl, honda, shindiawh), hand held equipment."
  },
  {
    "latitude": 44.56306373,
    "longitude": -123.2609795,
    "name": "Cell Phone Sick Bay",
    "address": "252 Sw Madison Ave, Suite 110",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "(541) 230-1785",
    "url": 0,
    "notes": "Cell phones and tablets"
  },
  {
    "latitude": 44.56128061,
    "longitude": -123.2722561,
    "name": "OSU Repair Fair",
    "address": "644 S.W. 13th St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "541-737-5398",
    "url": "http://fa.oregonstate.edu/surplus",
    "notes": "Oregon State University Property Services Building. Occurs twice per quarter in the evenings. Small appliances, Bicycles, Clothing, Computers (hardware and software) Electronics (small items only) Housewares (furniture, ceramics, lamps, etc.)"
  },
  {
    "latitude": 44.5634,
    "longitude": -123.2614,
    "name": "Footwise",
    "address": "301 SW Madison Ave #100",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "(541) 757-0875",
    "url": "http://footwise.com/",
    "notes": "resoles berkenstock"
  },
  {
    "latitude": 44.5611,
    "longitude": -123.2616,
    "name": "Robnett's",
    "address": "400 SW 2nd St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "(541) 753-5531",
    "url": "http://ww3.truevalue.com/robnetts/Home.aspx",
    "notes": "Reel Mowers adjustment and sharpening . Screen repair for windows and doors"
  },
  {
    "latitude": 44.5642145,
    "longitude": -123.261,
    "name": "Book binding",
    "address": "108 SW 3rd St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "(541) 757-9861",
    "url": "http://www.cornerstoneassociates.com/bj-bookbinding-about- us.html",
    "notes": "Rebind and restore books"
  },
  {
    "latitude": 44.56337065,
    "longitude": -123.2605795,
    "name": "Specialty Sewing By Leslie",
    "address": "225 SW Madison Ave",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "541) 758-4556",
    "url": "http://www.specialtysewing.com/Leslie_Seamstress/Welcome.html",
    "notes": "Alterations and custom work"
  },
  {
    "latitude": 44.5403,
    "longitude": -123.3671333,
    "name": "Furniture Restoration Center",
    "address": "1321 Main St",
    "city": "Philomath",
    "state": "OR",
    "zip": 97370,
    "phone": "(541) 929-6681",
    "url": "http://restorationsupplies.com/",
    "notes": "Restores all typers of furniture and has hardware for doing it yourself"
  },
  {
    "latitude": 44.56271524,
    "longitude": -123.2602886,
    "name": "Sedlack",
    "address": "225 SW 2nd St",
    "city": "Corvalis",
    "state": "OR",
    "zip": 97333,
    "phone": "(541) 752-1498",
    "url": "http://www.sedlaksshoes.net/",
    "notes": "full resoles, elastic and velcros, sewing and patching, leather patches, zippers, half soles and heels."
  }
])

// Add new fields  
// db.Businesses.update(
//   {}, 
//   { $set: { "location.coordinates" : [], "location.type" : "Point" } }, 
//   {
//     multi: true
//   }
// )

// Populate fields from old singlar long and lat fields
// db.Businesses.find().forEach(
//   function(elem) {
//     elem.location.coordinates.push(elem.longitude);
//     elem.location.coordinates.push(elem.latitude);
//     db.Businesses.save(elem);
//   }
// )

// Remove the long and lat fields
// db.Businesses.update({}, { $unset : {latitude: "", longitude: ""} }, {multi: true})