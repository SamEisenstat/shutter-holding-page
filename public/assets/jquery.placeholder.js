(function(e){function t(e){var t=e.attr("placeholder");n(e,t),e.focus(function(n){e.val()===t&&e.val("")}).blur(function(n){e.val()===""&&e.val(t)}).change(function(t){e.data("changed",e.val()!=="")})}function n(e,t){e.val()===""?e.val(t):e.data("changed",!0)}function r(t){var n=i(t);t.after(n),t.val()===""?t.hide():n.hide(),e(t).blur(function(e){if(t.val()!=="")return;t.hide(),n.show()}),e(n).focus(function(e){t.show().focus(),n.hide()})}function i(t){return e("<input>").attr({placeholder:t.attr("placeholder"),value:t.attr("placeholder"),id:t.attr("id"),readonly:!0}).addClass(t.attr("class"))}function s(t){t.find(":input[placeholder]").each(function(){if(e(this).data("changed")===!0)return;e(this).val()===e(this).attr("placeholder")&&e(this).val("")})}if("placeholder"in document.createElement("input"))return;e(document).ready(function(){e(":input[placeholder]").not(":password").each(function(){t(e(this))}),e(":password[placeholder]").each(function(){r(e(this))}),e("form").submit(function(t){s(e(this))})})})(jQuery);