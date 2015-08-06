function discussion_dance(runtime, element)
{
    function on_post_success()
    {
        alert("Doing on_post_success fn");
        /*
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_db'),
            data: JSON.stringify({comment: "Random"}),
            success: function(result)
                    {
                        if(result.fetch_status == "Success")
                        {
                            alert("Success! Obtained: " + result.db_data);
                            db_dict = JSON.parse(result.db_data);//This is now a dictionary keyed on comment id
                        }
                        else
                        {
                            alert("Didn't work" + result.fetch_status + " with data " + result.db_data);
                        }
                    }
        });*/
        alert('done!');
    }

    function long_poll()
    {
        alert("Long Poll");
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_db'),
            data: JSON.stringify({comment: "Random"}),
            success: function(result)
                    {
                        if(result.fetch_status == "Success")
                        {
                            alert("Success! Obtained: " + result.db_data);
                            db_dict = JSON.parse(result.db_data);//This is now a dictionary keyed on comment id
                        }
                        else
                        {
                            alert("Didn't work" + result.fetch_status + " with data " + result.db_data);
                        }
                        var delay = 10000;
                        setTimeout(function(){
                            long_poll();
                        }, delay)

                    }
        });
        alert('long poll done!');

    }

    function on_post_press()
    {
        alert("Ajax call to be made!");

        var jqCommentBox = $(element).find("#usercomment");
        alert("Comment to be sent is " + jqCommentBox.val());
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'post_comment'),
            data: JSON.stringify({comment: jqCommentBox.val()}),
            success: function(result)
                    {
                        if(result.update_status == "Success")
                        {
                            alert("Database updated!");
                            on_post_success();
                        }
                        else
                        {
                            alert("Database not updated! ret_val is " + result.update_status);
                        }
                    }
        });
        alert("Done with on_post_press");
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