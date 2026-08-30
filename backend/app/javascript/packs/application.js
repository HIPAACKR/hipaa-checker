// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import 'bootstrap'
import Rails from "@rails/ujs"
import "trix"
import "@rails/actiontext"
import "trix/dist/trix.css"


import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
ActiveStorage.start()

$(function () {
  $("#user_organization_id").change((e) => {
    e.preventDefault();
    if(e.target.value > ''){
      $("#organization_name_panel").hide();
    }
    else{
      $("#organization_name_panel").show()
    }
  })
  $(".plan_input").click(function (e) {
    if($(e.target).attr("plan_name").toLowerCase() == 'free'){
      $("#card_wrapper").attr("style", "display: none !important"); // No credit card is required while subscribing to free plan
    }
    else{
      $("#card_wrapper").show()
    }
  })
  $(".is_individual_radio_button").click(function () {
    if($(this).attr("id") == "user_is_individual_1"){
      $("#organization_area").hide()
    }
    else{
      $("#organization_area").show()
    }
  })

  $("#user_upload_environment").change(function (e) {
    if(e.target.value == 'web application'){
      $("#user_upload_platform").val("")
    }
    else if(e.target.value == 'app'){
      $("#user_upload_platform").val("apk")
    }
  })
})

require("trix")
require("@rails/actiontext")