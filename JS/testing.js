function main(){
  var btn = document.querySelector('input');
  btn.addEventListener('click', deleteDatabaseItems);
  console.log("no")
}


function deleteDatabaseItems(){
  console.log("yes")
  db.collection('UserInfo').drop(function(err, result){
    if (err) throw err;
    console.log('Login')
    res.redirect('/')
    })
}
