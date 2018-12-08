// Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you
    var map, infoWindow;

let markersArray = [];

// create map
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
      });
      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          addMarker(pos, "green");

          infoWindow.setPosition(pos);

          var hanoi = {
            lat: 21.01906424814991,
            lng: 105.8671532571316
          }
          infoWindow.setPosition(hanoi);

          infoWindow.setContent('You are here');

          infoWindow.open(map);
          map.setCenter(pos);

          // *** FETCH START ***
          fetch('restaurants.json')
            .then(response => response.json())
            .then(data => {

              data.forEach((x, i) => {

              // check x for any undefined, then filter them out
              // use filter functions

              // x.filter(y => undefined)

              var index = i + 1

              addMarker({lat: x.lat, lng: x.long}, "red", x, index)


                // 1. CREATE

                // make div
                var listing = document.createElement("div")
                listing.setAttribute('class', 'listing')

                // make listing-avatar div
                var listingAvatar = document.createElement("div")
                listingAvatar.setAttribute('class', 'listing-avatar')
                var picture = new Image()

                // make listing-info div
                var listingInfo = document.createElement("div")
                listingInfo.setAttribute('class', 'listing-info')

                  // listing-title
                  var listingTitle = document.createElement("div")
                  listingTitle.setAttribute('class', 'listing-title')

                  // reviews
                  var reviews = document.createElement("div")
                  reviews.setAttribute('class', 'reviews')

                    // stars
                    var stars = document.createElement("div")
                    stars.setAttribute('class', 'stars')

                    // span (bullet)
                    var bulletReviews = document.createElement("span")
                    bulletReviews.innerHTML = "&bull;";
                    bulletReviews.setAttribute('class', 'bullet')

                    // number of reviews
                    var numberOfReviews = document.createElement("span")
                    numberOfReviews.setAttribute('class', 'number-of-reviews')

                  // listing-price
                  var listingPrice = document.createElement("span")
                  listingPrice.setAttribute('class', 'listing-price')

                  // bullet to go between price and cusine
                  var bulletPriceCusine = document.createElement("span")
                  bulletPriceCusine.innerHTML = "&bull;";
                  bulletPriceCusine.setAttribute('class', 'bullet')

                  // listing-cusine
                  var listingCusine = document.createElement("span")
                  listingCusine.setAttribute('class', 'listing-cusine')

                  // infowindow
                  var restInfoWindow = document.createElement("div")
                      restInfoWindow.setAttribute('class', 'rest_info_window')


                  // 2. ARRANGE

                    // // put image tag into avatar div
                    listingAvatar.append(picture)

                    // put divs into reviews div
                    reviews.append(stars, bulletReviews, numberOfReviews)

                    // put divs into the listing-info
                    listingInfo.append(listingTitle, reviews, listingPrice, bulletPriceCusine, listingCusine)

                    // put everything inside the listing div
                    listing.append(listingAvatar, listingInfo)

                    // put everything into the restaurants div
                    var restaurantsDiv = document.getElementById('restaurants')
                    restaurantsDiv.append(listing)
                    // restInfoWindow.append(listing)


              // 3. INSERT DATA

            // create average of ratings
                // make average a global variable so it can be used as an argument in another function

                    // create count to use to calculate the average rating.
                    var count = 0;
                    for(var y = 0; y < x.ratings.length; y++) {
                    count += x.ratings[y].stars
                    }
                    x.average = count / x.ratings.length

            // insert avatar
                picture.src = x.image

            // insert name
                listingTitle.innerHTML = x.restaurantName
                listingTitle.prepend(`${index}. `)


            // review score
                // makeAverage()
                createStars(x.average)

            // add number of reviews function Here
                numberOfReviews.innerHTML = x.ratings.length + " reviews"

            // add price range here
                listingPrice.innerHTML = x.priceRange

            // add cusine here
                listingCusine.innerHTML = x.cusine

            // helper functions:
                function createStars(n) {
                  for(var x = 0; x < Math.round(n); x++) {
                    var actualStars = document.createElement("i")
                    actualStars.setAttribute('class', 'fas fa-star')
                    stars.append(actualStars)
                  }
                }

              })

            })  //END OF JSON FETCH


        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }

// handle location errors
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

    // add marker
        function addMarker(latLng, color, listing, listNumber) {

          if (listing !== undefined) {
            let url = "http://maps.google.com/mapfiles/ms/icons/";
            url += color + "-dot.png";

            let marker = new google.maps.Marker({
              map: map,
              position: latLng,
              icon: {
                url: url
              }
            });

            listNumber = listNumber ? `${listNumber}. ` : ""

            var restInfo = `
            <div class="listing">
              <div class="listing-avatar"><img src="${listing.image}"></div>
              <div class="listing-info infoWindow">
                <div class="listing-title">${listNumber}${listing.restaurantName}</div>
                <div class="listing-address">${listing.address}</div>
              </div>
            </div>
            `


            var infowindow = new google.maps.InfoWindow({
              content: restInfo
            });

            marker.addListener('mouseover', function() {
              infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function() {
              infowindow.close();
            });

            //store the marker object drawn in global array
            markersArray.push(marker);
          }


        }

// get city and country of location
        fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=21.01906424814991,%20105.8671532571316&key=AIzaSyAFAWdSJ9-ChPm_9XKsXG2aLGPDKc3aVfc')
          .then(response => response.json())
          .then(data => {
            var cityCountry = document.getElementById('city_and_country')
            cityCountry.innerHTML = data.results[5].formatted_address
          })
