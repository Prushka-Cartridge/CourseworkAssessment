
function deleteDatabseItems(){
  db.collection('UserInfo').drop(function(err, result){
    if (err) throw err;
    console.log('Login')
    res.redirect('/')
    })
}
