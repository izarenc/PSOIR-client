

"use strict";
var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var template = "list.ejs";
var prefix = "/perenc-lab4/";
var AWS = require("aws-sdk");
var fields = [];
var nazwy = [];
var adresy = [];
var message = 0;

var task = function(request, callback) {
	console.log("==================ROBIE LISTE===================");
    AWS.config.loadFromPath(AWS_CONFIG_FILE);
    var S3 = new AWS.S3();

    var params = {
        Bucket: 'perenc-lab4',
        /* required */
        Marker: 'photos'
    };
	
    fields = [];
    nazwy = [];
    adresy = [];
    S3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
			console.log(data.Contents.length);
            for (var j = 0; j < data.Contents.length-1; j++) {
				console.log(j);
				console.log("Znaleziono: " + j+" - "+data.Contents[j].Key);
                fields[j] = data.Contents[j+1].Key;
            }
            for (var i = 0; i < data.Contents.length-1; i++) {
                nazwy[i] = data.Contents[i+1].Key.substring(8);
                S3.getSignedUrl('getObject', params = {
                        Bucket: 'perenc-lab4',
                        Key: data.Contents[i+1].Key
                    },
                    (err, url) => {
                        adresy[i] = url;
                    }
                );
            }
            exports.Pola = fields;
            exports.Nazwy = nazwy;
            exports.Adresy = adresy;

            callback(null, {
                template: template,
                params: {
                    fields: fields,
                    bucket: "perenc-lab4",
                    names: nazwy,
                    adresy: adresy,
                    message: message
                }
            });
        }
    });
};
exports.action = task;
