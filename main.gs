function myFunction() {
  var tmp_date = new Date();
  var today = new Date(tmp_date.getFullYear(),tmp_date.getMonth(),tmp_date.getDate(),0,0,0);
  // スプレッドシートの内容を取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName("フォームの回答 1");
  var last_num = sheet1.getLastRow();
  var oneday_array = [];
  var threedays_array = [];
  var week_array = [];
  var month_array = [];
  var flag = false; //送信するかしないかの判断

  //numに合わせて1日後か3日後か1週間後か1か月後なら追加
  for(var i = 2; i <= last_num; i++){
    var content = sheet1.getRange(i, 2).getValue();
    var date = sheet1.getRange(i, 3).getValue();
    
    var dt = (today - date)/ 1000 / 60 / 60 / 24;
    if (dt == 1){
      oneday_array.push(content);
      flag = true;
    }else if(dt == 3){
      threedays_array.push(content);
      flag = true;
    }else if (dt == 7){
      week_array.push(content);
      flag = true;
    }else if(dt == 30){
      month_array.push(content);
      flag = true;
    }
  }
  
  //messageまとめる
  //""の配列で初期化
  var oneday_tmp_message = "";
  var threedays_tmp_message = "";
  var week_tmp_message = "";
  var month_tmp_message = "";
  
  for (var i = 0; i < oneday_array.length; i++){
    oneday_tmp_message += "\n" + oneday_array[i];
  }
  for (var i = 0; i < threedays_array.length; i++){
    threedays_tmp_message += "\n" + threedays_array[i];
  }
  for (var i = 0; i < week_array.length; i++){
    week_tmp_message += "\n" + week_array[i];
  }
  for (var i = 0; i < month_array.length; i++){
    month_tmp_message += "\n" + month_array[i];
  }
  
  var user_id = "***********";
  //ランダムでコメントを用意
  var comment = ["今日も一日頑張りましょう！","忘れたっていいんですよ","最近実は忘れっぽいんですよね","どうも、心理学者のヘルマン・エビングハウスです","忘れたやつはどうなるか、、わかりますよね"];
  ran = Math.floor(Math.random()*comment.length);
  
  //送信
  if (flag){
    var message = "[" + tmp_date.getFullYear() + "-" + (tmp_date.getMonth() +　1) +  "-" + today.getDate()  + "]" + "\n" + comment[ran] + "\n" + "<@" + user_id + ">";
    if (oneday_array.length >= 1){
      message += "\n-----1日前にやったこと----------";
      message += oneday_tmp_message;
    }
    if (threedays_array.length >= 1){
      message += "\n-----3日前にやったこと----------";
      message += threedays_tmp_message;
    }
    if (week_array.length >= 1){
      message += "\n-----1週間前にやったこと--------";
      message += week_tmp_message;
    }
    if (month_array.length >= 1){
      message += "\n-----1か月前にやったこと--------";
      message += month_tmp_message;
    }
    postMessage(message);
  }  
}
 
function postMessage(message) {
  
  var url = "https://slack.com/api/chat.postMessage";
  
  var payload = {
    "token" : "**********************************",
    "channel" : "******",
    "text" : message
  };
  
  var params = {
    "method" : "post",
    "payload" : payload
  };
  
  // Slackに投稿する
  UrlFetchApp.fetch(url, params);
}

//時間設定 朝8時に通知
function setTrigger(){
  const time = new Date();
  time.setHours(8);
  time.setMinutes(0);
  ScriptApp.newTrigger('myFunction').timeBased().at(time).create();
}