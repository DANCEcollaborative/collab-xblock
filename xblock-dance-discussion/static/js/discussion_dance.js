function discussion_dance(runtime, element)
{
    var max_comment_id = 0;

    $.ajaxSetup({ async: false});
    /*this is needed because otherwise, by the time the request is processed by the server and
    the callback is executed, the javascript has already been executed. Making the call synchronous, will halt execution
    till response is received.
    */

    function get_asset(asset_name)//asset name must include the extension of the asset
    {
        var ret_asset = '';
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_asset'),
            data: JSON.stringify({asset: asset_name}),
            success: function(result)
                    {
                        if(result.error == '')
                        {
                            ret_asset = result.asset;
                        }
                        else
                        {
                            alert("Didn't work" + result.error);//should replace this with some form of logging
                        }

                    }
        });
        //alert('asset fetch complete!'); //for some reason this is needed!
        return(ret_asset);

    }

    function comment_box_markup(comment_box_id, comment_object, html_asset)
    {
        if(parseInt(comment_box_id, 10) > max_comment_id)
        {
            max_comment_id = parseInt(comment_box_id, 10);
            div_id = "comment-box-" + comment_box_id;
            text_area_id = "usercomment-" + comment_box_id;
            html_asset = html_asset.replace('class="comment-box"', 'id="' + div_id + '" class="comment-box"');
            html_asset = html_asset.replace('id="usercomment"', 'id="' + text_area_id +'"');
            html_asset = html_asset.replace('{comment}', comment_object["comment"])
            $('.discussion-dance').append(html_asset);
        }
    }

    function update_ui(db_data)//asset name must include the extension of the asset
    {
        var html_asset = get_asset('comment_box.html');
        for(var comment_id in db_data)
        {
            comment_box_markup(comment_id, db_data[comment_id.toString()], html_asset);
        }

    }

    function long_poll()
    {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_db'),
            data: JSON.stringify({comment: "Random"}),
            success: function(result)
                    {
                        if(result.fetch_status == "Success")
                        {
                            db_dict = JSON.parse(result.db_data);//This is now a dictionary keyed on comment id
                            update_ui(db_dict);
                        }
                        else
                        {
                            alert("Didn't work" + result.fetch_status + " with data " + result.db_data);
                        }
                        var delay = 10000;
                        setTimeout(function(){
                            long_poll();
                        }, delay);

                    }
        });
    }

    function on_post_press()
    {

        var jqCommentBox = $(element).find("#usercomment");
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'post_comment'),
            data: JSON.stringify({comment: jqCommentBox.val()}),
            success: function(result)
                    {
                        if(result.update_status == "Success")
                        {
                            alert("Database updated!");
                        }
                        else
                        {
                            alert("Database not updated! ret_val is " + result.update_status);
                        }
                    }
        });
    }

    function clear_comment_box(comment_box_id)
    {
        var jqCommentBox = $(element).find("#" + comment_box_id);
        jqCommentBox.val("");
    }

    $(element).find("#Post").bind('click',function()
        {
            on_post_press();
            clear_comment_box("usercomment");
        }
    );

    $(element).find("#Clear").bind('click',function()
        {
            clear_comment_box("usercomment");
        }
    );
    long_poll();
}