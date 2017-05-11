export const filterGeneral = function(val,type){
	if(type == 'toChinese'){
		return val == 'male'||val == 'm' || val == '' ? '男' : "女";
	}else{
		return val == '男' || val == 'm' || val == 'M' || val == 'male' ? 'male' : "female";
	}
}
