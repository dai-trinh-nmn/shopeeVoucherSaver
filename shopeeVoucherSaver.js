javascript:(function() {
    if (window.location.hostname !== "shopee.vn") {
        alert("Bookmarklet không khả dụng với trang web đang mở, truy cập shopee.vn và thử lại!");
    } else {
        var link, urlParams, evCode, promotionId, signatureCode;

        link = prompt("Nhập link vốt chờ Sọp pe Live/Video bạn muốn lưu:");
    
        if (link) {
            try {
                var url = new URL(link);
    
                if (!url.hostname.includes("shopee.vn") || !url.pathname.includes("/voucher/details")) {
                    window.alert("Link bạn nhập không phải link vốt chờ");
                    return;
                }
    
                urlParams = new URLSearchParams(url.search);
                promotionId = urlParams.get("promotionId");
                signatureCode = urlParams.get("signature");
                evCode = urlParams.get("evcode");
    
                console.log("promotionId:", promotionId);
                console.log("signatureCode:", signatureCode);
    
                if (!promotionId || !signatureCode) {
                    window.alert("Link vốt chờ bạn nhập không hợp lệ!");
                    return;
                }
    
                promotionId = parseInt(promotionId, 10);
                if (isNaN(promotionId)) {
                    window.alert("promotionId không hợp lệ");
                    return;
                }
    
            } catch(e) {
                window.alert("Dữ liệu bạn nhập vào không phải URL hợp lệ");
                console.error(e);
                return;
            }
        } else {
            window.alert("Link không được nhập vào");
            return;
        }
    
        var voucherCode = atob(evCode);
        console.log(voucherCode);
    
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://shopee.vn/api/v2/voucher_wallet/save_vouchers", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log(xhr.responseText);
    
                        if (response.error === 0 && response.responses[0].error === 0) {
                            alert("Vốt chờ đã được lưu thành công!");
                        } else if (response.error === 0 && response.responses[0].error === 5) {
                            alert("Vốt chờ đã được lưu trước đó!");
                        } else if (response.error === 0 && response.responses[0].error === 14){
                            alert("Vốt chờ này không thể lưu trên tài khoản của bạn!");
                        } else {
                            handleError(response.error);
                        }
                    } catch(e) {
                        alert("Lỗi phân tích phản hồi!");
                    }
                } else {
                    alert("Gửi request thất bại!");
                }
            }
        };
    
        var requestBody = {
            voucher_identifiers: [
                {
                    promotion_id: promotionId,
                    voucher_code: voucherCode,
                    signature: signatureCode,
                    signature_source: 0
                }
            ]
        };
    
        console.log("Request Body:", JSON.stringify(requestBody));
        xhr.send(JSON.stringify(requestBody));
    
        function handleError(errorCode) {
            switch (errorCode) {
                case 19:
                    alert("Chưa đăng nhập!");
                    break;
                case 10002:
                    alert("Invalid Input!");
                    break;
                default:
                    alert("Lỗi chưa xác định!");
                    break;
            }
        }
    }
})();
