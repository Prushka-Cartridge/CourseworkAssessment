// Makes sure the searchbox has a value in it.
function validate(){
  var searchbox = document.getElementById("searchbox");
	var searchvalue = searchbox.value;

	if(searchvalue != ""){
				return true;
			} else {
				alert("please type a search query!");
				return false;
			}
}

// Gets the jsondata for the newest content, least popular and lowest rated.
function Content(){
  var urlNewest = "https://api.themoviedb.org/3/movie/latest?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US"
  $.getJSON(urlNewest, function(jsondata){
    addNewestContent(jsondata);
  });

  var urlLeast = "https://api.themoviedb.org/3/movie/popular?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page=1"
  $.getJSON(urlLeast, function(jsondata){
    if(jsondata.total_pages <= 1000){
      var urlLeast = "https://api.themoviedb.org/3/movie/popular?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page="+jsondata.total_pages
    } else {
      var urlLeast = "https://api.themoviedb.org/3/movie/popular?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page=1000"
    }
    $.getJSON(urlLeast, function(jsondata){
      addLeastContent(jsondata);
    });
  });

  var urlLowest = "https://api.themoviedb.org/3/movie/top_rated?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page=1"
  $.getJSON(urlLowest, function(jsondata){
    var urlLowest = "https://api.themoviedb.org/3/movie/top_rated?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page="+jsondata.total_pages
    $.getJSON(urlLowest, function(jsondata){
      addLowestContent(jsondata);
    });
  });

  motd();
}

// This adds the newest content info to the web page
function addNewestContent(values){
  console.log(values);
  var poster = "http://image.tmdb.org/t/p/w92" + values.poster_path;
  var title = values.title;
  var temp1 = "<div class = flex-item> <div class = poster><img src="+poster+" alt=poster></div>"
  var temp2 = "<div class = title> "+title+"</div></div>"
  var htmlstring = temp1 + temp2
  //console.log(htmlstring);
  $("#NewestAddition").append(htmlstring);
}

// This adds the least popular info to the web page
function addLeastContent(values){
  console.log(values);
  var poster = "http://image.tmdb.org/t/p/w92" + values.results[values.results.length-1].poster_path;
  var title = values.results[values.results.length-1].title;
  var temp1 = "<div class = flex-item> <div class = poster> <img src="+poster+" alt=poster></div>"
  var temp2 = "<div class = title> "+title+"</div></div>"
  var htmlstring = temp1 + temp2
  //console.log(htmlstring);
  $("#LeastPopular").append(htmlstring);
}

// This adds the lowest rated info to the web page
function addLowestContent(values){
  console.log(values);
  var poster = "http://image.tmdb.org/t/p/w92" + values.results[values.results.length-1].poster_path;
  var title = values.results[values.results.length-1].title;
  var temp1 = "<div class = flex-item> <div class = poster> <img src="+poster+" alt=poster></div>"
  var temp2 = "<div class = title> "+title+"</div></div>"
  var htmlstring = temp1 + temp2
  //console.log(htmlstring);
  $("#LowestRated").append(htmlstring);
}

// gets the movie title from the url
function ShowMoviesOnSearchPage(){
  var searchString = document.location.search;
  searchString = searchString.substring(1);
  var nvPairs = searchString.split("&");

	for (i = 0; i < nvPairs.length; i++) {
	   var nvPair = nvPairs[i].split("=");
	   var name = nvPair[0];
	   var value = nvPair[1];
  }

  var string = value.split("+");
  value = "";
  for(i = 0; i < string.length; i++){
    value += string[i] + " ";
  }
  console.log(value);
  getResultsFromTMDB(value);
  return false;
}

// gets the jsondata from the tmdb api
function getResultsFromTMDB(value){
  var url = "https://api.themoviedb.org/3/search/movie?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page=1&include_adult=false&query="+value;
  $.getJSON(url, function(jsondata){
    addMovieInfoToSearchPage(jsondata);
  });
}

// adds the movie info to the search page
function addMovieInfoToSearchPage(jsondata){
  var htmlstring = "";
  //console.log(jsondata);
  var counter = 0;
  //console.log(jsondata.total_results-1)
  if(jsondata.results.length == 0){// Check to see if jsondata.reults is empty
      htmlstring = "There is no movies with that title"
  }
  for(var i = 0; i < jsondata.results.length; i++){
    //console.log("i:"+i)
    if(jsondata.results[i].title == null){
    } else {
      var title = jsondata.results[i].title;
      var poster = "http://image.tmdb.org/t/p/w92" + jsondata.results[i].poster_path;
      var string = title;
      var url = string[0];

      for(var h = 1; h < string.length; h++){
        if(string[h] == " "){
          url += "+"
        } else {
          url += string[h]
        }
      }

      var img = "<img src="+poster+" alt=Poster>";

      var link = "MoviePage?q=" + url;
      var temp1 = "<div class = flex-item>"
      var temp2 = "<a href="+ link +">"
      var temp3 = "<div class = poster>" + img + "</div>"
      var temp4 = "<div class = title><input type=hidden>" + title + "</div>"
      var temp5 = "</div>"
      htmlstring += temp1 + temp2 + temp3 + temp4 + temp5

      //console.log(htmlstring);
      //console.log(counter);
    }
    counter++;
  }
  $("#searchResults").append(htmlstring);
}

// gets the movie title from the url
function ShowMoviesOnMoviePage(){
  var searchString = document.location.search;
  searchString = searchString.substring(1);
  var nvPairs = searchString.split("&");

	for (i = 0; i < nvPairs.length; i++) {
	   var nvPair = nvPairs[i].split("=");
	   var name = nvPair[0];
	   var value = nvPair[1];
  }

  var string = value.split("+");
  value = "";
  for(i = 0; i < string.length; i++){
    value += string[i] + " ";
  }
  console.log(value);
  getResultsFromTMDB2(value);
  return false;
}

// gets the jsondata from the tmdb api
function getResultsFromTMDB2(value){
  var url = "https://api.themoviedb.org/3/search/movie?api_key=95e3a26ca455cd0b5d455ae9fa52acad&language=en-US&page=1&include_adult=false&query="+value;
  $.getJSON(url, function(jsondata){
    addMovieInfoToMoviePage(jsondata)
  });
}

// adds the movie info to the movie page
function addMovieInfoToMoviePage(jsondata){
  var htmlstring = "";
  var title = jsondata.results[0].title;
  var poster = "http://image.tmdb.org/t/p/w92" + jsondata.results[0].poster_path;
  var description = jsondata.results[0].overview;

  var img = "<img src="+poster+" id=view alt=poster>";
  if(title == null){

  } else {
    var imgString =  "<div class = image>" +  img + "</div>";
    var titleString = "<div class = title><h2 name = title>" + title + "</h2></div>";
    var descriptionString = "<div class = description><h3 id=moviedesc>" + description + "</h3></div>";
    //var yearString = "<div class = year>Release Year:" + year + "</div></div>";
    htmlstring = imgString + titleString + descriptionString;
    console.log(htmlstring);
    //htmlstring = "<div class = oneMovie> <div class = image>" +  img + "</div> <div class = title> Title:" + title + "  </div> <div class = year>Release Year:" + year + "</div></div>";
    $("#movieDisplay").append(htmlstring);
  }
}


// Get the modal

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById('id01');
  var modal2 = document.getElementById('id02');
  var modal3 = document.getElementById('id03');
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if(event.target == modal2) {
        modal2.style.display = "none";
    }
    else if(event.target == modal3) {
      modal3.style.display = "none";
    }
}


function motd(){
  var motdArray = [" I did not hit her, it's not true! It's bullshit! I did not hit her! [throws water bottle]","Oh hi Mark!","Hi doggie!","You betrayed me! You're not good. You, you're just a chicken. Chip-chip-chip-chip-cheep-cheep."];
  var motdFooter = ["Stay a while and listen!","Did somebody say [Thunderfury, Blessed Blade of the Windseeker]?","You're pretty good","Stop! You violated the law!"];
  document.getElementById("Title").innerHTML = motdArray[Math.floor((Math.random() * motdArray.length-1) + 1)];
  document.getElementById("tatum").innerHTML = "Copyright Not Reserved 2018 FOUL FLICKS | "+motdFooter[Math.floor((Math.random() * motdArray.length-1) + 1)];
  //document.getElementById("subheader").innerHTML = motdArray[Math.floor((Math.random() * motdArray.length-1) + 1)];

}
