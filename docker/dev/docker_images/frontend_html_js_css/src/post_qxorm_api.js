var info = {};

$(document).ready(function() {
   $("#lstRequestExample").change(function() {
      var id = $(this).children(":selected").attr("id");
      var request = buildRequestExample(id);
      $("#txtRequest").val(JSON.stringify(request, null, 3));
      $("#txtResponse").val("");
   });

   $("#btnSendRequest").click(function() {
      sendRequest($("#txtRequest").val());
   });

   $('select option:even').css({'background-color': '#e6ffe6'});
   $('#lstRequestExample option[id="ping"]').prop("selected", true);
   var request = buildRequestExample("ping");
   $("#txtRequest").val(JSON.stringify(request, null, 3));
   $("#txtResponse").val("");

   setTimeout(function() {
      var request = buildRequestExample("ping");
      sendRequest(JSON.stringify(request), function(request, response) {
         if (response.error) { $("#lblDatabaseType").text(response.error); }
         else { $("#lblDatabaseType").text(response.database_type); $("#lblDatabaseVersion").text(response.database_version); }
         if (info) { info.ping = response; }
      });
   }, 500);
});

function sendRequest(request, callback) {
   try { var obj = JSON.parse(request); } catch(exc) { obj = null; }
   var url = ((obj && (obj.action == "ping")) ? "/ping" : "/qx");
   $.post(url, request, function(data, status, xhr) {
      if (callback) { callback(obj, data); }
      else { $("#txtResponse").val(JSON.stringify(data, null, 3)); }
      if ((info) && (data) && (info[data.request_id]))
      { info[info[data.request_id]]["response"] = data; }
   }, "json").fail(function(error) {
      var msg = "An error occurred sending request to QxOrm HTTP server : " + error;
      if (callback) { callback(obj, { error: msg }); }
      else { alert(msg); }
   });
}

function buildRequestExample(id) {
   var request = {};
   request.request_id = createGUID();
   if (id == "ping") {
      request.action = "ping";
   }
   else if (id == "get_meta_data") {
      request.action = "get_meta_data";
      request.entity = "*";
   }
   else if (id == "fetch_all_blogs") {
      request.action = "fetch_all";
      request.entity = "blog";
   }
   else if (id == "fetch_all_blogs_as_collection") {
      request.action = "fetch_all";
      request.entity = "blog";
      request.data = [ { key: "", value: "" } ]
   }
   else if (id == "fetch_all_blogs_with_relationships") {
      request.action = "fetch_all";
      request.entity = "blog";
      request.relations = [ "*->*" ];
   }
   else if (id == "fetch_all_blogs_with_relationships_output_format") {
      request.action = "fetch_all";
      request.entity = "blog";
      request.relations = [ "<blog_alias> { blog_text }", "author_id <author_alias> { name, birthdate }", "list_comment <list_comment_alias> { comment_text } -> blog_id <blog_alias_2> -> * <..._my_alias_suffix>" ];
      request.output_format = [ "{ blog_text }", "author_id { name, birthdate }", "list_comment { comment_text } -> blog_id -> *" ];
   }
   else if (id == "fetch_blog_by_id") {
      request.action = "fetch_by_id";
      request.entity = "blog";
      request.data = { blog_id: 1 };
   }
   else if (id == "fetch_blog_by_id_columns") {
      request.action = "fetch_by_id";
      request.entity = "blog";
      request.data = { blog_id: 1 };
      request.columns = [ "blog_text", "date_creation" ];
   }
   else if (id == "fetch_list_of_blog_by_id") {
      request.action = "fetch_by_id";
      request.entity = "blog";
      request.data = [ { blog_id: 1 }, { blog_id: 2 }, { blog_id: 3 } ];
   }
   else if (id == "fetch_list_of_blog_by_id_output_format") {
      request.action = "fetch_by_id";
      request.entity = "blog";
      request.data = [ { blog_id: 1 }, { blog_id: 2 } ];
      request.relations = [ "{ blog_text }", "author_id <author_alias> { name, birthdate }", "list_comment <list_comment_alias> { comment_text }" ];
      request.output_format = [ "{ blog_text }", "author_id { name, birthdate }", "list_comment { comment_text }" ];
   }
   else if (id == "fetch_authors_by_query") {
      request.action = "fetch_by_query";
      request.entity = "author";
      request.query = {
         sql: "WHERE author.sex = :sex", 
         params: [ { key: ":sex", value: 1, type: "in" } ]
      };
   }
   else if (id == "fetch_authors_by_query_with_relationships") {
      request.action = "fetch_by_query";
      request.entity = "author";
      request.query = {
         sql: "WHERE author.sex = :sex", 
         params: [ { key: ":sex", value: 1, type: "in" } ]
      };
      request.relations = [ "*" ];
   }
   else if (id == "fetch_authors_by_query_with_relationships_output_format") {
      request.action = "fetch_by_query";
      request.entity = "author";
      request.query = {
         sql: "WHERE author.sex = :sex", 
         params: [ { key: ":sex", value: 1, type: "in" } ]
      };
      request.relations = [ "*" ];
      request.output_format = [ "{ birthdate, name }", "list_blog { blog_text, date_creation }" ];
   }
   else if (id == "insert_blog") {
      request.action = "insert";
      request.entity = "blog";
      request.data = {
         blog_text: "this is a new blog from QxOrm REST API !", 
         date_creation: "2018-01-30T12:42:01", 
         author_id: "author_id_2"
      };
   }
   else if (id == "insert_list_of_blog") {
      request.action = "insert";
      request.entity = "blog";
      request.data = [
         {
            blog_text: "new blog from QxOrm REST API !", 
            date_creation: "2018-01-30T12:42:01", 
            author_id: "author_id_2"
         }, 
         {
            blog_text: "another blog from QxOrm REST API !", 
            date_creation: "2016-06-12T08:33:12", 
            author_id: "author_id_1"
         }
      ];
   }
   else if (id == "insert_author") {
      request.action = "insert";
      request.entity = "author";
      request.data = {
         author_id: "author_id_from_rest_api", 
         birthdate: "1978-05-11", 
         name: "new author created by QxOrm REST API", 
         sex: 1
      };
   }
   else if (id == "insert_category") {
      request.action = "insert";
      request.entity = "category";
      request.data = {
         description: "category from REST API", 
         name: "new_category"
      };
   }
   else if (id == "update_blog") {
      request.action = "update";
      request.entity = "blog";
      request.data = {
         blog_id: 1, 
         blog_text: "modify blog from QxOrm REST API", 
         date_creation: "2013-11-25T09:56:33", 
         author_id: "author_id_1"
      };
   }
   else if (id == "update_blog_columns") {
      request.action = "update";
      request.entity = "blog";
      request.data = {
         blog_id: 2, 
         blog_text: "modify blog from QxOrm REST API", 
         date_creation: "2013-11-25T09:56:33"
      };
      request.columns = [ "blog_text", "date_creation" ];
   }
   else if (id == "update_author") {
      request.action = "update";
      request.entity = "author";
      request.data = {
         author_id: "author_id_from_rest_api", 
         birthdate: "1992-11-03", 
         name: "modify author from QxOrm REST API", 
         sex: 0
      };
   }
   else if (id == "update_list_of_author") {
      request.action = "update";
      request.entity = "author";
      request.data = [
         {
            author_id: "author_id_from_rest_api", 
            birthdate: "1992-11-03", 
            name: "modify author from QxOrm REST API", 
            sex: 0
         }, 
         {
            author_id: "author_id_1", 
            birthdate: "1978-12-25", 
            name: "modify another author from QxOrm REST API", 
            sex: 2
         }
      ];
   }
   else if (id == "update_category") {
      request.action = "update";
      request.entity = "category";
      request.data = {
         category_id: 1, 
         description: "category modified by REST API", 
         name: "modif_category"
      };
   }
   else if (id == "save_blog") {
      request.action = "save";
      request.entity = "blog";
      request.data = {
         blog_id: 1, 
         blog_text: "modify blog from QxOrm REST API", 
         date_creation: "2013-11-25T09:56:33", 
         author_id: "author_id_1"
      };
   }
   else if (id == "save_list_of_blog") {
      request.action = "save";
      request.entity = "blog";
      request.data = [
         {
            blog_id: 1, 
            blog_text: "save blog from QxOrm REST API !", 
            date_creation: "2018-01-30T12:42:01", 
            author_id: "author_id_2"
         }, 
         {
            blog_text: "save another blog from QxOrm REST API !", 
            date_creation: "2016-06-12T08:33:12", 
            author_id: "author_id_1"
         }
      ];
   }
   else if (id == "save_blog_recursive") {
      request.action = "save";
      request.entity = "blog";
      request.data = {
         blog_id: 1, 
         blog_text: "save recursive blog from QxOrm REST API", 
         date_creation: "2013-11-25T09:56:33", 
         author_id: {
            author_id: "author_id_1", 
            birthdate: "1965-07-21", 
            name: "save recursive author from QxOrm REST API", 
            sex: 0
         }
      };
      request.save_mode = "check_insert_or_update";
   }
   else if (id == "save_blog_recursive_insert") {
      request.action = "save";
      request.entity = "blog";
      request.data = {
         blog_text: "save recursive - new blog from QxOrm REST API", 
         date_creation: "2013-11-25T09:56:33", 
         author_id: {
            author_id: "author_id_save_recursive", 
            birthdate: "1965-07-21", 
            name: "save recursive (insert only) author from QxOrm REST API", 
            sex: 0
         }
      };
      request.save_mode = "insert_only";
   }
   else if (id == "exist_blog") {
      request.action = "exist";
      request.entity = "blog";
      request.data = { blog_id: 1 };
   }
   else if (id == "exist_list_of_blog") {
      request.action = "exist";
      request.entity = "blog";
      request.data = [ { blog_id: 1 }, { blog_id: 999 }, { blog_id: 3 } ];
   }
   else if (id == "exist_author") {
      request.action = "exist";
      request.entity = "author";
      request.data = { author_id: "author_id_2" };
   }
   else if (id == "validate_blog") {
      request.action = "validate";
      request.entity = "blog";
      request.data = { blog_id: 9999, blog_text: "" };
   }
   else if (id == "count_all_blog") {
      request.action = "count";
      request.entity = "blog";
   }
   else if (id == "count_author_with_query") {
      request.action = "count";
      request.entity = "author";
      request.query = {
         sql: "WHERE author.sex = :sex", 
         params: [ { key: ":sex", value: 1 } ]
      };
   }
   else if (id == "count_blog_with_query_and_relationships") {
      request.action = "count";
      request.entity = "blog";
      request.query = {
         sql: "WHERE author_alias.sex = :sex", 
         params: [ { key: ":sex", value: 1 } ]
      };
      request.relations = [ "author_id <author_alias> { sex }" ];
   }
   else if (id == "delete_blog_by_id") {
      request.action = "delete_by_id";
      request.entity = "blog";
      request.data = { blog_id: 4 };
   }
   else if (id == "delete_list_of_blog_by_id") {
      request.action = "delete_by_id";
      request.entity = "blog";
      request.data = [ { blog_id: 3 }, { blog_id: 2 } ];
   }
   else if (id == "delete_author_by_query") {
      request.action = "delete_by_query";
      request.entity = "author";
      request.query = {
         sql: "WHERE author.sex = :sex", 
         params: [ { key: ":sex", value: 1 } ]
      };
   }
   else if (id == "delete_all_comment") {
      request.action = "delete_all";
      request.entity = "comment";
   }
   else if (id == "call_custom_query") {
      request.action = "call_custom_query";
      request.query = {
         sql: "INSERT INTO author (author_id, name, birthdate, sex) VALUES (:author_id, :name, :birthdate, :sex)", 
         params: [
            { key: ":author_id", value: "author_id_custom_query" }, 
            { key: ":name", value: "new author inserted by custom query" }, 
            { key: ":birthdate", value: "20190215" }, 
            { key: ":sex", value: 2 }
         ]
      };
   }
   else if (id == "call_entity_function") {
      request.action = "call_entity_function";
      request.entity = "blog";
      request.fct = "helloWorld";
      request.data = { param1: "test", param2: "static fct call" };
   }
   else if (id == "several_requests_in_array") {
      request = [ buildRequestExample("get_meta_data"), 
                  buildRequestExample("fetch_all_blogs"), 
                  buildRequestExample("exist_blog"), 
                  buildRequestExample("call_entity_function") ];
   }
   else {
      request.error = "<unknown request example : " + id + ">";
   }
   if ((info) && (info.ping) && (info.ping.database_type == "mongodb")) {
      request = buildRequestExampleMongoDB(id, request);
   }
   if ((info) && (! request.error) && (id != "ping")) {
      info[id] = { request: request };
      info[request.request_id] = id;
   }
   return request;
}

// Specific for MongoDB database : change some request properties, for example :
// - identifiers as string instead of integer
// - queries as json instead of sql
function buildRequestExampleMongoDB(id, request) {
   if ((info) && (request) && (! request.error)) {
      var action = request.action;
      if (((action == "fetch_by_id") || (action == "update") || (action == "save") || (action == "exist") || (action == "delete_by_id")) && (request.entity == "blog")) {
         if (request.save_mode == "insert_only") { return request; }
         var response = ((info.fetch_all_blogs) ? info.fetch_all_blogs.response : null);
         if (! response) { response = ((info.fetch_all_blogs_with_relationships) ? info.fetch_all_blogs_with_relationships.response : null); }
         if (! response) { response = ((info.fetch_all_blogs_with_relationships_output_format) ? info.fetch_all_blogs_with_relationships_output_format.response : null); }
         if (response && response.data) {
            var array_blog_id = [];
            for (var i = 0; i < response.data.length; i++) {
               var blog_id = response.data[i].blog_id;
               if (blog_id) { array_blog_id.push(blog_id); }
            }
            if (array_blog_id.length > 0) {
               if (Array.isArray(request.data)) {
                  for (var i = 0; i < request.data.length; i++) {
                     request.data[i].blog_id = ((array_blog_id[i]) ? array_blog_id[i] : array_blog_id[0]);
                  }
               }
               else {
                  request.data.blog_id = array_blog_id[0];
               }
            }
         }
      }
      else if (id == "fetch_authors_by_query") {
         request.query = {
            json: [
               { sex: 0 },
               { sort: { sex: -1 }, limit: 1 }
            ]
         };
      }
      else if ((id == "fetch_authors_by_query_with_relationships") || (id == "fetch_authors_by_query_with_relationships_output_format")) {
         request.query = { json: { sex: 0 } };
      }
      else if (id == "count_author_with_query") {
         request.query = { json: { sex: 0 } };
      }
      else if (id == "count_blog_with_query_and_relationships") {
         request.query = { json: { "author_id.sex": 0 } };
      }
      else if (id == "delete_author_by_query") {
         request.query = {
            type: "aggregate",
            json: "[ { \"$match\": { \"sex\": 0 } } ]"
         };
      }
      else if (id == "call_custom_query") {
         // Put json query as string to be sure to keep properties order : if 'filter' is before 'find', then MongoDB returns an error
         request.query = {
            type: "cursor",
            json: "{ \"find\": \"author\", \"filter\": { } }"
         };
      }
   }
   return request;
}

function createGUID() {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}
