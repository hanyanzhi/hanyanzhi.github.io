$(function(){
    var footerContent = '<a href="index.html" class="i_item fl active">'+
                        '<span class="i_icon"></span></a>'+
                        '<a href="shopcar.html" class="i_item fl">'+
                        '<span class="i_icon"></span></a>'+
                        '<a href="my-center.html" class="i_item fl">'+
                        '<span class="i_icon"></span></a>';
    $('footer').html(footerContent);
    var carFloat = '<a href="shopcar.html">'+
                    '<div class="car-all-num"><span class="small-font">'+
                    '9'+'</span></div></a>'+
                    '<div class="fly"><img src="img/waterM.png" alt=""></div>';
    $('.car-float').html(carFloat);
    // $('.product-item').on('click',function(){
    //     window.location.href = 'detail.html';
    // })
});
