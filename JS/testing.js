var btn = document.querySelector('input');
btn.addEventListener('click', deleteDatabseItems);
console.log("no")

function deleteDatabseItems(){
  console.log("yes")
  db.collection('UserInfo').drop(function(err, result){
    if (err) throw err;
    console.log('Login')
    res.redirect('/')
    })
}
