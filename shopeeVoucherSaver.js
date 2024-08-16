javascript:(function() {
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
                alert("Vốt chờ đã được lưu! " + xhr.responseText);
            } else {
                alert("Vốt chờ lưu thất bại! Mã trạng thái: " + xhr.status + ", Nội dung trả về: " + xhr.responseText);
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
})();
