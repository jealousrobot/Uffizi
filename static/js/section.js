// PlexArt - View all of the artwork for Plex sections at once          
// Copyright (C) 2016  Jason Ellis                                      
//                                                                      
// This program is free software: you can redistribute it and/or modify 
// it under the terms of the GNU General Public License as published by 
// the Free Software Foundation, either version 3 of the License, or    
// (at your option) any later version.                                  
//                                                                      
// This program is distributed in the hope that it will be useful,      
// but WITHOUT ANY WARRANTY; without even the implied warranty of       
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        
// GNU General Public License for more details.                         
//                                                                      
// You should have received a copy of the GNU General Public License    
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

$(document).ready(function(){
    
  function getKey(inputID) {
    var idPos = inputID.search('-') + 1;
    var keyValue = inputID.substr(idPos, inputID.length);
        
    return keyValue;
  }
    
  function getMetaValue(metaName) {
    return document.getElementById(metaName).getAttribute('content'); 
  }
  
  function getDisplayModeCookie() {
    // Set the cookie for the page and the display mode.
    var cookieDisplayMode = 'displayMode-' + Cookies.get('server') + '-' + Cookies.get('key');
      
    return cookieDisplayMode;
  }
  
  function getPlexURL() {
    //var plexURL = 'http://' + Cookies.get('server') + ':' + Cookies.get('port'); 
    //var plexURL = 'http://' + getMetaValue('metaServer') + ':' + getMetaValue('metaPort');
    var plexURL = gPlexURL;
    
    return plexURL;
  }
  
  function thumbsListRedirect(displayMode) {
    
    // Get the URL for the current page.
    var queryString = window.location.search;
    
    // Get the parameters from the URL.
    var URLVariables = queryString.split('&');
    
    // Rebuild the URL with the existing parameters and setting the
    // display_mode to the selected value.
    var newURL = 'section' + URLVariables[0] + '&' + URLVariables[1] + '&' + URLVariables[2] + '&' + URLVariables[3];
      
    Cookies.set(getDisplayModeCookie(), displayMode);

    //newURL += '=' + displayMode;
    
    // Call the new URL.  This method will cause the page to refresh without
    // putting a new entry in the history.
    window.location.replace(newURL); 
  }
    
  function positionDrawer(seasonID) {
    // Determine how far to the left the seasons DIV needs to
    // be moved.  As loaded, the DIV is lined up on the left 
    // with the video thumbnail.
        
    var videoLeft;
    var seasonLeft;
    var firstLeft;
    var i;
        
    // Get the ID associated with the video block of the season.
    var videoID = 'block-' + getKey(seasonID);
        
    // Get all of the video blocks.                    
    var videoBlocks = document.getElementsByClassName('video_block'); 
        
    // Loop through the video blocks to get to the block defined in
    // videoID.
    for (i=0; i<videoBlocks.length; i++) {
            
      // Save the value of the first block.  This is needed 
      // for calculating the left offset of the season block.
      if (i == 0) {
        firstLeft = videoBlocks[i].offsetLeft;
      }
      
      // If the current block is the video block we are after
      // derive the value to shift the season block.
      if (videoBlocks[i].id == videoID) {
        // If the offsetLeft of the current video block is
        // the same as the first block, then this block is
        // in the first column and the season block is already 
        // where it needs to be.
        if (videoBlocks[i].offsetLeft != firstLeft) {
          seasonLeft = (videoBlocks[i].offsetLeft - firstLeft) * -1;
          $(seasonID).css('left',seasonLeft);
        }
        else
          $(seasonID).css('left', 0);
        // We found what we are looking for.  No need to
        // continue looping.
        break;
      }
    }    
  }
    
  // Set the width of the seasons DIV elements.
  function setDimensions() {
    var seasonTop;
    var elementID;
    var seasonID;
    var stopRowCheck = 0
    var totalWidth;
    
    // Determine what the height of the results DIV should be.  It is the
    // size of the display area minus the heights of the header and the nav
    // bar.
    var resultsHeight = window.innerHeight - 90;
    $('#results').css('height', resultsHeight);
    
    //var section_type = getMetaValue('metaSectionType');
    //var display_mode = getMetaValue('metaDisplayMode');
    var section_type = gSectionType;
    displayModeCookie = getDisplayModeCookie();
    var display_mode = Cookies.get(displayModeCookie);
    
    // Set the width of the drawer that shows seasons/albums.
    if (section_type == 'show' || section_type == 'artist')
    {
      if (display_mode == 'list') {
        totalWidth = '100%';
      }
      else {
        // Get the array of video_block elements.  This is to get the size of 
        // one of the blocks.
        var videoBlocks = document.getElementsByClassName('video_block'); 
        
        // Get the overall style of the block.
        var blockStyle = videoBlocks[0].currentStyle || window.getComputedStyle(videoBlocks[0]);
        
        // Get the full width of the block, this is the width of the element 
        // along with the margins.
        var blockWidth = videoBlocks[0].offsetWidth + 
          parseFloat(blockStyle.marginLeft) +
          parseFloat(blockStyle.marginRight);
        
        // Determine the total number of elements that can fit inside the 
        // results DIV.
        var nbrElements = Math.trunc($('#results_container').width() / blockWidth);
        
        // Set the width of the drawer to be the width of the number of elements
        // that will fit in the results section.
        totalWidth = nbrElements * blockWidth;
      }
            
      $('.seasons').css('width', totalWidth); 
      
      // Determine if there is an open drawer.  If so, reposition as it's
      // now probably no longer aligned to the left edge of the display
      // area.  
      //var drawerID = getMetaValue('metaSlider');
      var drawerID = gDrawerID;
    
      if (drawerID != null) {
        positionDrawer(drawerID);
      }
    }
  }
    
  function rotateImage(sliderID, direction) {
    var elementID = getKey(sliderID);
    var drawerID = "#drawer-" + elementID;
    var deg = '';
    
    if (direction == 'down')
      $(drawerID).rotate({animateTo:180})
    else 
      $(drawerID).rotate({animateTo:0})
  }   
    
  function showSeasons(elementName) {
      
    var metaSetValue;
    
    //var plex_url = getMetaValue('metaPlexUrl');
    var plex_url = getPlexURL();
    
    // Get the content of the meta tag metaSlider, which contains the 
    // currently open season block.
    //var slider = getMetaValue('metaSlider');
    var slider = gDrawerID;
    
    if (slider != null) {
      $(slider).slideUp('slow');
      
      // Rotate the icon of the open drawer
      rotateImage(slider, 'up');
    }
    
    // Based on the element that was clicked, and provided in the 
    // elementName input paraemter, build the ID value of the DIV for the
    // drawer.
    var elementID = getKey(elementName); 
    var seasonID = '#season-' + elementID;
    
    // Get the XML for the seasons for the TV Show
    $.ajax({
      type: 'GET',
      dataType: 'xml',
      url: plex_url + '/library/metadata/' + elementID + '/children',
      success: parseSeasonXML
    });
    
    function parseSeasonXML(xml) {
      var result = '';
      
      $(xml).find('Directory').each(function()
      {
        // Skip the first record
        if ($(this).attr('parentRatingKey') == elementID) {
          result += '<div class="' + div_name + '">';
          result += '    <div class="season">';
          result += '        <div class="season_img"><img id="seasonImage-' + $(this).attr('ratingKey') + '" class="' + elementID + '" src="' + plex_url + $(this).attr('thumb') + '" width="100" height="' + img_height + '"></div>';
          result += '        <div class="season_title">' + $(this).attr('title') + '</div>';
          result += '    </div>';
          result += '</div>';
        }
      });
      
      $(seasonID).html(result);
    }   
    
    positionDrawer(seasonID);                 
                                            
    // Toggle the DIV holding the season images.
    if (seasonID != slider) {
      $(seasonID).slideDown('slow');
      metaSetValue = seasonID;
      rotateImage(seasonID, 'down');
    }
    else {
      metaSetValue = "x";
    }
    
    //document.getElementById('metaSlider').setAttribute('content', metaSetValue);
    gDrawerID = metaSetValue;
  }
     
  function refreshVideo(elementName) {
    //var plexURL = getMetaValue('metaPlexUrl');
    //var sectionType = getMetaValue('metaSectionType');
    //var displayMode = getMetaValue('metaDisplayMode');
    var plexURL = getPlexURL();
    var sectionType = gSectionType;
    var displayMode = Cookies.get(getDisplayModeCookie());
    
    var elementID = getKey(elementName);
    var thumbID = '#thumb-' + elementID;
    var artID = '#art-' + elementID;
    var seasonID = '#season-' + elementID;
    var genreID = '#list_item_genre-' + elementID;
    var collectionID = '#list_item_collection-' + elementID;
    var playlistID = '#list_item_playlist-' + elementID;
    
    // Rotate the refresh button one time.
    $('#refresh-' + elementID).rotate({
      duration:3000,
      angle: 0,
      animateTo:360
    });
              
    // All of the seasons have the same class assigned to them.  The class is
    // named after the key of the show/artist.  Fade out all of the 
    // seasons/albums at once using the class.  This will also fade out the
    // genre/collection/playlist items if in list mode.
    $('.' + elementID).fadeTo('slow', .1);
    
    $(playlistID).fadeTo('slow', .1);
     
    // Fade out the old images.  Refreshed image will be faded in later.
    $(thumbID).fadeTo('slow', .1);
    $(artID).fadeTo('slow', .1, refreshData);
    
    function refreshData() {
      var playlistOut = '';
      //var plexServer = getMetaValue('metaServer');
      //var plexPort = getMetaValue('metaPort');
      var plexServer = gServer;
      var plexPort = gPort;
      
      $.ajax({
        type: 'GET',
        dataType: 'html',
        url: '/playlist?server=' + plexServer + '&port=' + plexPort + '&rating_key=' + elementID,
        success: function(xml){
          playlistOut = xml;
          $(playlistID).html(playlistOut);
          $(playlistID).fadeTo('slow', 1);
        },
      });
      
      // Get the XML for the video.  This contains the paths to the thumb and 
      // artwork.
      $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: plexURL + '/library/metadata/' + elementID,
        success: reloadImage
      });
      
      // Function that proceses once the AJAX call has completed.
      function reloadImage(xml) {
        var thumb = '';
        var art = '';
        var sectionElement = '';
        var genreOut = '';
        var collectionOut = '';
        var playlistOut = '';
        
        // Get the information for playlists this item belongs to.  Playlists
        // are not provided in the XML that contains the rest of the data on
        // the video so this alternate route is needed.
        //var playlists = new XMLHttpRequest();
        //playlists.open('GET', plexURL + '/playlists');
        
        // Based on the type of section, set the element to look for in the
        // XML.
        if (sectionType == 'show' || sectionType == 'artist')
          sectionElement = 'Directory';
        else
          sectionElement = 'Video';
        
        // Build the URL for the image.
        $(xml).find(sectionElement).each(function()
        {
          thumb = plexURL + $(this).attr('thumb');
          art = plexURL + $(this).attr('art');
          
          if (displayMode == 'list') {
            $(xml).find('Genre').each(function() {
              if (genreOut) 
                genreOut = genreOut + ' / ' + $(this).attr('tag');
              else
                genreOut = $(this).attr('tag');
            });
            
            $(xml).find('Collection').each(function() {
              if (collectionOut)
                collectionOut = collectionOut + ' / ' + $(this).attr('tag');
              else
                collectionOut = $(this).attr('tag');
            });
          }
        });
                  
        // Refresh the seasons if a TV show or music
        if (sectionType == 'show' || sectionType == 'artist') {
          // Get the XML for the seasons for the TV Show
          $.ajax({
            type: 'GET',
            dataType: 'xml',
            url: plexURL + '/library/metadata/' + elementID + '/children',
            success: parseSeasonXML
          });
          
          function parseSeasonXML(xml) {
            var seasonImagePath = '';
            var seasonImageID = '';
              
            $(xml).find('Directory').each(function()
            {
              // Skip the first record as it not a season/album.
              if ($(this).attr('parentRatingKey') == elementID) {
                seasonImageID = '#seasonImage-' + $(this).attr('ratingKey');
                seasonImagePath = plexURL + $(this).attr('thumb') + 'x';
                $(seasonImageID).attr("src", seasonImagePath);
              }
            });
              
            // Update the genre/collection/playlist sections if in list
            // mode.
            if (displayMode == 'list') {
              $(genreID).html(genreOut);
              $(collectionID).html(collectionOut);
            }
              
            // Fade the seasons/album back and list mode items too.
            $('.' + elementID).fadeTo('slow', 1);
               
            // Update the source to the new image and fade it back in.
            $(thumbID).attr('src', thumb);
            $(thumbID).fadeTo('slow', 1);
            $(artID).attr('src', art);
            $(artID).fadeTo('slow', 1);
          }
        }
        else {
          // Update the genre/collection/playlist sections if in list mode.
          if (displayMode == 'list') {
            $(genreID).html(genreOut);
            $(collectionID).html(collectionOut);
          }
          $('.' + elementID).fadeTo('slow', 1);            
          
          // Update the source and fade everything back in.
          $(thumbID).attr('src', thumb);
          $(thumbID).fadeTo('slow', 1);
          $(artID).attr('src', art);
          $(artID).fadeTo('slow', 1);
        }
      }
    }
  }
        
  $(".video_img").click(function(){
    //showSeasons($(this).attr("id"));
    var seasonID = '#season-' + getKey($(this).attr('id'));
    positionDrawer(seasonID);
    
    alert(gServer + ' ' + gPort);
  });
  
  $(".video_title").click(function(){
    //var elementID = getKey($(this).attr("id"));
    //var seasonID = '#season-' + elementID;
    //$(seasonID).slideDown('slow');
  });
  
  $(".video_drawer").click(function(){
    showSeasons($(this).attr("id"));
  });
  
  $(".seasons").click(function(){
    showSeasons($(this).attr("id"));
  });
  
  $(".video_refresh").click(function(){
    refreshVideo($(this).attr("id"));
  });
  
  $("#navbar_thumbs").click(function(){
    thumbsListRedirect('thumbs');
  });
  
  $("#navbar_list").click(function(){
    thumbsListRedirect('list');
  });
  
  $(window).resize(function(){
    // If the window is resized, reset the widths of the 
    // seasons DIVs.
    setDimensions();
  });
    
  // Get the section type from the meta tag.
  //var section_type = getMetaValue('metaSectionType');
  var section_type = gSectionType;
    
  // Calling set_dimensions here will set the width for all of the 
  // season DIVs after the page has loaded.
  setDimensions();
    
  if (section_type == 'show') {
    div_name = 'season_block_tv';
    img_height = '150';
  }
  else {
    div_name = 'season_block_music';
    img_height = '100'
  }
  
  // If the display mode is list, load the meta data for the video.
  //var display_mode = getMetaValue('metaDisplayMode');
  var display_mode = Cookies.get(getDisplayModeCookie());
  if (display_mode == 'list') {
    // Get all of the list detail elements.
    var listDetails = document.getElementsByClassName('list_details'); 
     
    //var plexURL = getMetaValue('metaPlexUrl');
    var plexURL = getPlexURL();
         
    // Loop through the list detail elements.
    for (i=0; i<listDetails.length; i++) {  
      var elementID = getKey(listDetails[i].id);
       
      // Get the XML data about the video.  This will provide info for the
      // generes and collections.
      $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: plexURL + '/library/metadata/' + elementID,
        success: parseXML
      });
       
      function parseXML(xml) {
        var genre = '';
        var collection = '';
        var playlist = '';
        var elementID = '';
         
        // Get the ID of the element.  Due to the async nature of this section
        // I was having issues with using the elementID from the for loop, so
        // we'll get it again.
        if (section_type == 'show' || section_type == 'artist')
          tagType = 'Directory';
        else
          tagType = 'Video';
         
        $(xml).find(tagType).each(function() {
          elementID = $(this).attr('ratingKey');
        });
         
        // Build the ID values of the elements that need to be updated.
        var genreDIV = '#list_item_genre-' + elementID
        var collectionDIV = '#list_item_collection-' + elementID
         
        // Loop through the genre tags in the XML and get the names of the 
        // genres assigned to this video.
        $(xml).find('Genre').each(function()
        {
          if (genre)
            genre += ' / ' + $(this).attr('tag');
          else
            genre = $(this).attr('tag');
        });
         
        // Loop through the collection tags in the XML and get the names of the
        // collections assigned to this video.
        $(xml).find('Collection').each(function()
        {
          if (collection)
            collection += ' / ' + $(this).attr('tag');
          else
            collection = $(this).attr('tag');
        });
         
        // Update the HTML with the genres and collections assigned to this 
        // video.
        if (!genre)
          genre = 'None'
           
        if (!collection)
          collection = 'None'
           
        $(genreDIV).html(genre);
        $(collectionDIV).html(collection);
      }
    }
  }
});