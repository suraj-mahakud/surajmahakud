app
    .directive('validFile', function() {
        return {
            require: 'ngModel',
            link: function(scope, el, attrs, ngModel) {
                el.bind('change', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
                });
            }
        }
    })
    .controller("CompanyEventController", function($scope, $timeout, $http, $window, CompanyEventService) {
        getEvents();

        function getEvents() {
            $scope.isPageLoading = true;
            $scope.EventList = null;
            var getAllEventService = CompanyEventService.getEventList();
            getAllEventService.then(function(response) {
                $scope.EventList = response.data;
                $scope.isPageLoading = false;
            }, function(error) {
                $scope.isPageLoading = false;
            });
        }
        $scope.gotoEventDetail = function(obj) {
            debugger
            window.localStorage['selectedJobOpening'] = angular.toJson(obj);
            $window.location.href = 'company-event-detail.html';
        };
    })
    .controller("RequestCallbackController", function($scope, $timeout, $http, $window, RequestCallbackService) {
        $scope.SendRequest = function() {
            var pageURL = window.location.pathname;
            var pageName = pageURL.split('/')[1];

            $scope.isProposalLoader = true;
            $scope.Helpyou.PageName = pageName;
            var getEnquiry = RequestCallbackService.SendRequest($scope.Helpyou);
            getEnquiry.then(function(response) {
                $window.location.href = 'thank-you.html';
                $scope.isProposalLoader = false;
                $scope.Helpyou.Name = "";
                $scope.Helpyou.Mobile = "";
                $scope.Helpyou.Email = "";
                $scope.Helpyou.Message = "";
                $scope.Helpyou.PageName = "";
                $scope.EnquiryForm.$setPristine();

            }, function(Error) {
                $scope.isProposalLoader = false;
                alert(Error.data.Message);
            });
        }
    })
    .controller('CareersOpeningController', function($scope, $http, $location, $window, $sce, $rootScope, CareerService) {
        $scope.isLoadingPage = true;
        $scope.isResumeFileSelected = false;
        $scope.isApplyLoader = false;
        window.localStorage['selectedJobOpening'] = null;
        if (window.localStorage['selectedJobOpening1'] == null || window.localStorage['selectedJobOpening1'] == undefined || window.localStorage['selectedJobOpening1'] == "null") {
            window.localStorage['selectedJobOpening1'] = null;
        } else {
            $scope.selectedJobOpening1 = JSON.parse(window.localStorage['selectedJobOpening1']);
            $scope.selectedJob = ($scope.selectedJobOpening1.CAREER_ID).toString();
        }

        GetAllCareer();

        function GetAllCareer() {
            var getAllCareer = CareerService.getCareer();
            getAllCareer.then(function(response) {
                console.log(response.data);
                $scope.jobOpening = response.data;
                for (c = 0; c < $scope.jobOpening.length; c++) {
                    $scope.jobOpening[c]["REQUIREMENT"] = $sce.trustAsHtml(response.data[c]["REQUIREMENT"]);
                    $scope.jobOpening[c]["RESPONSIBILITIES"] = $sce.trustAsHtml(response.data[c]["RESPONSIBILITIES"]);
                }

                if ($scope.jobOpening.length > 0)
                    $scope.isJobAvailable = true;
                else
                    $scope.isJobAvailable = false;

                $scope.isLoadingPage = false;
            }, function(error) {
                console.log(error);
                $scope.isLoadingPage = false;
                $scope.isJobAvailable = true;
            });

        }

        function getBase64(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                $scope.resumeFile = reader.result;
                $scope.isResumeFileSelected = true;
                $scope.$apply();
            };
            reader.onerror = function(error) {
                $scope.isResumeFileSelected = false;
            };
        }
        $scope.ApplyNow = function(obj) {
            window.localStorage['selectedJobOpening1'] = angular.toJson(obj);
            $window.location.href = 'careers-form.html';
        }
        $scope.file_changed = function(element) {
            $scope.$apply(function(scope) {
                if (element.files[0] != undefined && element.files[0] != null)
                    getBase64(element.files[0]);
                else
                    $scope.isResumeFileSelected = false;
            });
        };
        $scope.careerApply = function() {
            if (document.getElementById("IsValidCareerCaptcha").value == "1") {
                $scope.isApplyLoader = true;

                $scope.Career.Captcha = document.getElementById("IsValidCareerCaptchaResponse").value;
                $scope.Career.CAREER_USER_RESUME = $scope.resumeFile;
                $scope.Career.CAREER_ID = parseInt($scope.selectedJob);
                console.log($scope.Career);
                var userCareerApply = CareerService.postUserCareer($scope.Career);
                userCareerApply.then(function(response) {
                    $scope.isApplyLoader = false;
                    window.localStorage['selectedJobOpening'] = null;
                    window.localStorage['selectedJobOpening1'] = null;
                    $window.location.href = 'Thank-you.html';
                }, function(error) {
                    $scope.isApplyLoader = false;
                    failurePopup("Career Apply Fail", error.data.Message);
                });
            } else {
                failurePopup("Career Apply Fail", "Please Verify Captcha");
            }
        };
    })
    .controller('EnquiryController', function($scope, $http, $filter, $location, $window, $rootScope, EnquiryService) {
        $scope.regex = '^[0-9+-]+$';

        $scope.Enquiry = [];
        $scope.invalidService = false;
        $scope.Enquiry.CountryData = "India";
        $scope.checkedService = "";
        $scope.isServiceChanged = false;

        $scope.selectedServiceList = [{
                'text': 'Web Application Development',
                'value': 'Web Application Development'
            },
            {
                'text': 'Mobile Applications Development',
                'value': 'Mobile Applications Development'
            },
            {
                'text': 'E-Commerce Portals',
                'value': 'E-Commerce Portals'
            },
            {
                'text': 'Website Design Services',
                'value': 'Website Design Services'
            },
            {
                'text': 'Digital Marketing',
                'value': 'Digital Marketing'
            },
            {
                'text': 'IT Infrastructure Solutions',
                'value': 'IT Infrastructure Solutions'
            }
        ];

        $scope.isProposalLoader = false;


        $scope.selectedServices = function() {
            $scope.isServiceChanged = true;
            var checkedList = $filter('filter')($scope.selectedServiceList, {
                checked: true
            });
            $scope.Enquiry.Services = $.map(checkedList, function(obj) {
                return obj.value
            }).join(', ');
            if ($scope.Enquiry.Services == "" || $scope.Enquiry.Services == undefined || $scope.Enquiry.Services == null)
                $scope.invalidService = true;
            else
                $scope.invalidService = false;
        }

        $scope.SendEnquiry = function() {
            if (document.getElementById("IsValidCareerCaptcha").value == "1") {
                $scope.isProposalLoader = true;
                $scope.Enquiry.Captcha = document.getElementById("IsValidCareerCaptchaResponse").value;
                var getEnquiry = EnquiryService.sendEnquiry($scope.Enquiry);
                getEnquiry.then(function(response) {
                    $scope.isProposalLoader = false;
                    window.localStorage['thanxMessage'] = "Hi " + $scope.Enquiry.Name + ", We are happy to hear you. We will answer you as soon as possible.";
                    $scope.invalidService = true;
                    $scope.isServiceChanged = false;

                    $scope.Enquiry.Name = "";
                    $scope.Enquiry.Company = "";
                    $scope.Enquiry.Email = "";
                    $scope.Enquiry.Contact = "";
                    $scope.Enquiry.CountryData = "India";

                    $scope.Enquiry.Services = "";

                    $scope.checkedService = "";
                    $scope.Enquiry.Requirements = "";
                    $scope.Enquiry.Captcha = "";
                    $scope.EnquiryForm.$setPristine();

                    $("#imgrefresh").click();

                    $window.location.href = 'thank-you.html';

                }, function(Error) {
                    $scope.isProposalLoader = false;
                    alert(Error.data.Message);
                });
            } else {
                failurePopup("Career Apply Fail", "Please Verify Captcha");
            }
        }
    })
    .controller('CompanyEventDetailController', function($scope, $timeout, $http, $window, $sce, CompanyEventService) {
        $scope.isPageLoading = true;
        String.prototype.replaceAll = function(s, r) {
            return this.split(s).join(r)
        }
        if (window.localStorage['selectedJobOpening'] == null || window.localStorage['selectedJobOpening'] == undefined || window.localStorage['selectedJobOpening'] == "null") {
            $window.location.href = 'company-event.html';
        } else {
            $scope.selectedJobOpening = JSON.parse(window.localStorage['selectedJobOpening']);
            $("#eventTitle").text($scope.selectedJobOpening.EVENT_TITLE);
            $("#liEventTitle").text($scope.selectedJobOpening.EVENT_TITLE);
        }

        getEventsDetail();

        function getEventsDetail() {
            $scope.isPageLoading = true;
            $scope.EventImageList = null;
            var getAllEventService = CompanyEventService.getEventImageList($scope.selectedJobOpening.EVENT_ID);
            getAllEventService.then(function(response) {
                $scope.EventImageList = response.data;
                $scope.isPageLoading = false;
            }, function(error) {
                $scope.isPageLoading = false;
            });
        }

        //$scope.getEventImages = function (obj) {
        //    loadEventImages(obj, false);
        //};

        function loadEventImages(obj, isResetSlider) {
            if (obj.EventImageList == null || obj.EventImageList === undefined) {
                var getAllEventImageService = CompanyEventService.getEventImageList(obj.EVENT_ID);
                getAllEventImageService.then(function(response) {
                    obj.EventImageList = response.data;
                }, function(error) {});
            }
        }
    });