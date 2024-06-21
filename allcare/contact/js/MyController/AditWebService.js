var app = angular.module("AditWebApp", [])
    .factory('ApiUrl', function() {
        return 'https://www.theallcare.in/';
        //return 'https://aditmicrosys.apphost.in/';
        //return 'http://localhost:64845/';
    });

app.service('CompanyEventService', function($http, ApiUrl) {
        this.getEventList = function(data) {
            return $http.get(ApiUrl + "api/EventApi/GetAllEvent");
        };
        this.getEventImageList = function(id) {
            return $http.get(ApiUrl + "api/EventApi/GetAllImages?eventid=" + id);
        };
    })
    .service('RequestCallbackService', function($http, ApiUrl) {
        this.SendRequest = function(data) {
            return $http.post(ApiUrl + "api/HelpyouApi/SendEnquiry", {
                "NAME": data.Name,
                "EMAIL": data.Email,
                "Mobile": data.Mobile,
                "Message": data.Message,
                "PageName": data.PageName
            });
        };
    })
    .service('CareerService', function($http, ApiUrl) {
        this.getCareer = function() {
            return $http.get(ApiUrl + "api/CareerApi/GetAllCareer")
        };
        this.postUserCareer = function(data) {
            var obj = {
                "CareerId": data.CAREER_ID,
                "Name": data.Name,
                "ContactNo": data.MobileNumber,
                "Email": data.email,
                "UserResume": data.CAREER_USER_RESUME,
                "Captcha": data.Captcha
            };
            return $http.post(ApiUrl + "api/UserApi/ApplyJob", obj, null);
        };
    })
    .service('EnquiryService', function($http, ApiUrl) {
        this.sendEnquiry = function(data) {
            return $http.post(ApiUrl + "api/EnquiryApi/SaveEnquiry", {
                "NAME": data.Name,
                "COMPANY_NAME": data.Company,
                "EMAIL": data.Email,
                "CONTACT_NUMBER": data.Contact,
                "COUNTRY": data.CountryData,
                "SERVICE": data.Services,
                "REQUIREMENTS": data.Requirements,
                "Captcha": data.Captcha
            });
        };
    });

// $(document).ready(function(){
// $("a:contains('Document Management System')").hide();
// });