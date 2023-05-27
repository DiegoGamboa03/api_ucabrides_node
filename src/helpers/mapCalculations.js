function degreesToRadians(degrees){
    return (degrees * Math.PI) / 180;
};

export function distanceBetweenTwoPoints(latA, lngA, latB, lngB) {
    let latA_radians = degreesToRadians(latA);
    let lngA_radians = degreesToRadians(lngA);
    let latB_radians = degreesToRadians(latB);
    let lngB_radians = degreesToRadians(lngB);
    // Aplicar fórmula de haversine
    const RADIUS_EARTH_IN_KILOMETERS = 6371;
    let differenceLng = lngB_radians - lngA_radians;
    let differenceLat = latB_radians - latA_radians;
    
    //a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
    let a =
      Math.pow(Math.sin(differenceLat / 2.0), 2) +
      Math.cos(latA_radians) *
        Math.cos(latB_radians) *
        Math.pow(Math.sin(differenceLng / 2.0), 2);
    //c = 2 * atan2(sqrt(a), sqrt(1-a))
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //d = Radio Tierra * c
    return RADIUS_EARTH_IN_KILOMETERS * c * 1000; //Multiplicamos por 1000 para convertir de km a m
  };
  
  export const shortessPath = (directions,user_location) => {
  var lat,lng = 0;
  var minimunDistance = distanceBetweenTwoPoints(
    directions[0].lat(),directions[0].lng(),
    user_location.lat,user_location.lng
  );
  var aux = 0;
  //DADA UNA DIRECCION, RECORRE LA DIRECCION Y CALCULA LA DISTANCIA 
  //DE CADA PUNTO CON RESPECTO A LA CASA DEL USUARIO
  directions.forEach(function (direction) {
    aux = distanceBetweenTwoPoints(
      direction.lat,
      direction.lng,
      user_location.lat,
      user_location.lng
    );
    if (aux <= minimunDistance) {
      minimunDistance = aux;
      lat = direccion.lat;
      lng = direccion.lng;
    }
  });

  let result = {
    minimunDistance: minimunDistance,
    lat: lat,
    lng: lng
  }
  return result;
};