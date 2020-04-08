var keying = "";
var hashing = "";
var challenge_message_server = "";
var challenge_message_client = "";
var password_client = "password";
var password_server = "";
var chm_pas_client = "";
var chm_pas_server = "";
var hashed_response_client = "";
var expected_response_server = "";

var session_key = "";
var encrypted_session_key = "";
var encrypted_session_key_server = "";
var decrypted_session_key_server = "";


var plaintext = "";
var client_key_plaintext = "";
var client_HMAC = "";
var client_message = "";
var server_message = "";
var server_transmitted_HMAC = "";
var server_plaintext = "";
var server_key = "";
var server_key_plaintext = "";
var server_HMAC = "";

$(document).on("click", "#btn_ongoing", function (e) {
    plaintext=$("#stage4_plaintext_client").val();
    ongoing(plaintext);
});

function ongoing(plaintext)
{
    plaintext = plaintext;
    session_key = location.href.split("&")[1];
    client_key_plaintext = session_key + plaintext;
    client_HMAC = SHA256(client_key_plaintext);
    client_message = client_HMAC+ "+" + plaintext;

    var data = {
        "stage_info" : "Ongoing",
        "client_message" : client_message
    };
    $.ajax({
        url:"http://54.180.191.50/Admin.php",
        type:"POST",
        data: JSON.stringify(data),
        success: function(result) {
            if (result)
            {
                var result1 = JSON.parse(result);
                server_message = result1.received_message;
                server_transmitted_HMAC = result1.received_HMAC;
                server_plaintext = result1.received_plainText;
                server_key = result1.server_Key;
                server_key_plaintext = server_key + server_plaintext;
                server_HMAC = SHA256(server_key_plaintext);

                setTimeout(function(){$("#stage4_key_client").val(session_key);},1000);
                setTimeout(function(){$("#stage4_Key_Plaintext_client").val(client_key_plaintext);},2000);
                setTimeout(function(){$("#stage4_HMAC_client").val(client_HMAC);},3000);
                setTimeout(function(){$("#stage4_HMAC_Plaintext_client").val(client_message);},4000);

                setTimeout(function(){$("#stage4_transmitted_server").val(server_message);},5000);
                setTimeout(function(){$("#stage4_plaintext_server").val(server_plaintext);},6000);
                setTimeout(function(){$("#stage4_key_server").val(server_key);},7000);
                setTimeout(function(){$("#stage4_key_plaintext_server").val(server_key_plaintext);},8000);
                setTimeout(function(){$("#stage4_Transmitted_HMAC_server").val(server_transmitted_HMAC);},9000);
                setTimeout(function(){$("#stage4_HMAC_server").val(server_HMAC);},10000);
                setTimeout(function () {
                        if (result1.confirm == 1)
                        {
                            $("#stage4_confirm").val("서명 되었습니다.");
                            setTimeout(function () {
                                alert("Certificated!");
                            }, 1000);
                        }
                        else
                            {
                                setTimeout(function () {
                                    alert("Failed Certification!");
                                }, 1000);
                            }
                    },11000);

            }
            else {
                alert("불러오기 실패");
            }
        },
        error: function(error){
            alert(error);
        }

    });
}
function authenticate()
{
    challenge_message_server = location.href.split("=")[1].split("&")[0];
    challenge_message_client = location.href.split("=")[1].split("&")[1];
    chm_pas_client = password_client + challenge_message_client;
    hashed_response_client = SHA256(chm_pas_client);

    var data = {
        "stage_info" : "Authentication",
        "Hashed_Message_Of_Client" : hashed_response_client
    };
    $.ajax({
        url:"http://54.180.191.50/Admin.php",
        type:"POST",
        data: JSON.stringify(data),
        success: function(result) {
            if (result)
            {
                var result1 = JSON.parse(result);
                password_server = result1.Password_Of_Server;
                expected_response_server = result1.Hashed_Message_Of_Server;
                chm_pas_server = password_server + challenge_message_server;
                setTimeout(function(){$("#stage2_challenge_message_server").val(challenge_message_server);},1000);
                setTimeout(function(){$("#stage2_challenge_message_client").val(challenge_message_client);},2000);
                setTimeout(function(){$("#stage2_password_client").val(password_client);},3000);
                setTimeout(function(){$("#stage2_CM_PW_client").val(chm_pas_client);},4000);
                setTimeout(function(){$("#stage2_response_client").val(hashed_response_client);},5000);
                setTimeout(function(){$("#stage2_password_server").val(password_server);},6000);
                setTimeout(function(){$("#stage2_CM_PW_server").val(chm_pas_server);},7000);
                setTimeout(function(){$("#stage2_expected_response").val(expected_response_server);},8000);
                setTimeout(function(){$("#stage2_transmitted_response").val(hashed_response_client);},9000);
                setTimeout(function(){
                    if(result1.confirm==1)
                     {
                         $("#stage2_confirm").val("인증 되었습니다.");
                         setTimeout(function()
                         {
                             alert("Authenticated!");
                             location.href = "./stage3.html";

                         },1000);



                      }
                    else if (result1.confirm==0)
                         alert("Failed Negotiation");
                    },10000);

            } else {
                alert("불러오기 실패");
            }
        },
        error: function(error){
            alert(error);
        }
    });
}


$(document).on("click", "#btn_start", function (e) {
    keying=$("#stage1_key").val();
    hashing=$("#stage1_hash").val();
    start_secure();
});

function start_secure()
{

        var data = {
            "stage_info" : "Negotiation",
            "Keying_Algorithm" : keying,
            "Hashing_Algorithm" : hashing
        };
        $.ajax({
            url:"http://54.180.191.50/Admin.php",
            type:"POST",
            data: JSON.stringify(data),
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(result) {
                if (result)
                {
                    var result1 = JSON.parse(result);
                    if(result1.confirm==1)
                    {
                        challenge_message_server = result1.Challenge_Message;
                        challenge_message_client = challenge_message_server;

                        $("#stage1_confirm").val("승인완료");

                        setTimeout(function(){alert("Negotiated!");},1000);
                        setTimeout(function(){location.href = "./stage2.html?type="+challenge_message_server+"&"+challenge_message_client;},2000);

                    }
                    else
                        alert("Failed Negotiation");

                } else {
                    alert("불러오기 실패");
                }
            },
            error: function(error){
                alert(error);
            }
        });
}

var server_n = "";

function get_publickey()
{
    var client_n = "";
    var key = Public_Key();
    client_public_key = key[0];
    client_private_key = key[1];
    client_n = key[2];
    var data = {
        "stage_info" : "Public_Key",
        "client_public_key" : client_public_key,
    };

    $.ajax({
        url:"http://54.180.191.50/Admin.php",
        type:"POST",
        data: JSON.stringify(data),
        success: function(result) {
            if (result)
            {
                var result1 = JSON.parse(result);
                server_public_key = result1.Public_Key_Server;
                server_n = result1.n_server;
                keying_stage(client_private_key, client_public_key, server_public_key, client_n, server_n);
            } else {
                alert("publickey 불러오기 실패");
            }
        },
        error: function(error){
            alert(error);
        }
    });
}

function keying_stage(client_private_key, client_public_key, server_public_key, client_n, server_n)
{
    session_key = Math.floor(Math.random()*30)+1;
    encrypted_session_key = encrypt(server_public_key, server_n, session_key);
    encrypted_session_key = encrypted_session_key*1;
    setTimeout(function(){$("#stage3_session_key_client").val(session_key);},1000);
    setTimeout(function(){$("#stage3_encrypted_session_key_client").val(encrypted_session_key);},2000);

    var data = {
        "stage_info" : "Keying",
        "encrypted_session_key" : encrypted_session_key
    };

    $.ajax({
        url:"http://54.180.191.50/Admin.php",
        type:"POST",
        data: JSON.stringify(data),
        success: function(result) {
            if (result)
            {
                var result1 = JSON.parse(result);
                encrypted_session_key_server = result1.encryptedKey;
                decrypted_session_key_server = result1.decryptedKey;

                setTimeout(function(){$("#stage3_encrypted_session_key_server").val(encrypted_session_key_server);},3000);
                setTimeout(function(){$("#stage3_decrypted_session_key_server").val(decrypted_session_key_server);},4000);
                setTimeout(function(){

                    if(result1.confirm ==1)
                    {
                        $("#stage3_confirm").val("키가 전달되었습니다");
                        setTimeout(function () {
                            alert("Session Key is transmitted!");
                            location.href = "./stage4.html?type="+"&"+session_key;
                        },1000);
                    }
                    else
                        $("#stage3_confirm").val("키전달 실패");
                },5000);
            } else {
                alert("불러오기 실패");
            }
        },
        error: function(error){
            alert(error);
        }

    });

}


function SHA256(s){

    var chrsz   = 8;
    var hexcase = 0;

    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

    function core_sha256 (m, l) {

        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
            0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
            0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
            0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
            0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
            0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
            0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F,
            0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}


function gcd(num1, num2)
{
    var rest = "";
    rest = rest*1;
    while (num2 != 0) {
        rest = num1 % num2;
        num1 = num2;
        num2 = rest;
    }
    return num1;
}

function getN(p, q)
{
    var n = p * q;
    return n;
}

function getTotient(p, q)
{
    var totient = "";
    totient = totient*1;
    totient = (p - 1) * (q - 1);

    return totient;
}

function publicKey(totient)
{
    var e = "";
    e = e*1
    e = 2;
    while (e < totient && gcd(e, totient) != 1) {
        e += 1;
    }
    return e;
}

function privateKey(e, totient)
{
    var d = "";
    d = d*1;
    d = 2;
    while ((d * e) % totient != 1 || d == e) {
        d += 1;
    }
    return d;
}

function encrypt(e, n, sessionKey)
{
    var encryptedKey = "";
    encryptedKey = encryptedKey*1;
    encryptedKey = (Math.pow(sessionKey,e)) % n;
    return encryptedKey;
}

function decrypt(d, n, encryptedKey)
{
    var decryptedKey = "";
    decryptedKey = decryptedKey*1;
    decryptedKey = (encryptedKey * d) % n;
    return decryptedKey;
}

var Public_Key =  function()
{
    /* Client의 public key 생성 */
    var p_Client = 1;
    var q_Client = 1;
    var n_Client = 1;
    var totient_Client = 1;
    var Public_Key_Client = 1;
    var Private_Key_Client = 1;


    p_Client = Math.floor(Math.random()*50)+1;
    q_Client = Math.floor(Math.random()*50)+1;

    n_Client = getN(p_Client, q_Client);
    totient_Client = getTotient(p_Client, q_Client);
    Public_Key_Client = publicKey(totient_Client); //Public Key
    Private_Key_Client = privateKey(Public_Key_Client, totient_Client); //Private Key

    return [Public_Key_Client, Private_Key_Client, n_Client];

}


