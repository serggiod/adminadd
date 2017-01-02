angular
.module('legapp')
.controller('actividadController',function($scope,$rootScope,$http,$session){
	
	$scope.routes = {
		get:{
			actividades:'/rest/ful/adminadd/index.php/actividades',
			actividad  :'/rest/ful/adminadd/index.php/actividad/'
		},
		post:{
			actividad  :'/rest/ful/adminadd/index.php/actividad'
		},
		put:{
			actividad  :'/rest/ful/adminadd/index.php/actividad/'
		},
		delete:{
			actividad  :'/rest/ful/adminadd/index.php/actividad/',
			archivo    :'/rest/ful/adminadd/index.php/actividad/archivo/'
		}
	};

	$scope.modelo = {
		key:'',
		id:'',
		titulo:'',
		actividad:'',
		requisitos:'',
		estado:'',
		fecha:'',
		archivos:[]
	};

	$scope.lista = [];

	$scope.statusbar = {
		display:false,
		progress:'0'
	};

	$scope.forms  = {
		actividadNuevo:{
			display:false,
			cancelar:()=>{
				$scope.modelo.key=null;
				$scope.modelo.id=null;
				$scope.displayFalse();
				$scope.forms.actividadListar.display=true;
			},
			aceptar:()=>{
				$scope.displayFalse();
				$session.autorize(()=>{
					$http
						.post($scope.routes.post.actividad,$scope.modelo)
						.error(()=>{console.log($scope.routes.post.actividad+' : No Data');})
						.success((json)=>{if(json.result)$scope.listaReset();});
				});
				$scope.forms.actividadListar.display=true;
			}
		},
		actividadModificar:{
			display:false,
			cancelar:()=>{
				$scope.modelo.id=null;
				$scope.displayFalse();
				$scope.forms.actividadListar.display=true;
			},
			aceptar:()=>{
				$scope.displayFalse();
				uri = $scope.routes.put.actividad+$scope.modelo.id;
				$http
					.put(uri,$scope.modelo)
					.error(()=>{console.log(uri+' : No Data');})
					.success((json)=>{if(json.result)$scope.listaReset();});
			}
		},
		actividadVisualizar:{
			display:false,
			aceptar:()=>{
				$scope.listaReset();
			},
		
		},
		actividadListar:{
			display:false,
			nuevaActividad:()=>{
				d = new Date();
				$scope.displayFalse();
				$scope.modelo.id='';
				$scope.modelo.titulo='';
				$scope.modelo.actividad='';
				$scope.modelo.requisitos='';
				$scope.modelo.estado='INACTIVO';
				$scope.modelo.fecha='';
				$scope.modelo.fecha += d.getFullYear().toString()+'-';
				$scope.modelo.fecha += (d.getMonth() +1).toString()+'-';
				$scope.modelo.fecha += d.getDate().toString()+' ';
				$scope.modelo.fecha += d.getHours().toString()+':';
				$scope.modelo.fecha += d.getMinutes().toString()+':';
				$scope.modelo.fecha += d.getSeconds().toString();
				$scope.modelo.archivos=[];
				$scope.forms.actividadNuevo.display=true;
			},
			visualizarActividad:(k)=>{
				id = $scope.lista[k].id;
				$scope.displayFalse();
				$scope.statusbar.display=true;
				$scope.statusbar.progress=100;
				$http
					.get($scope.routes.get.actividad+id)
					.error(()=>{console.log($scope.routes.get.actividad+id+' : No Data');})
					.success((json)=>{if(json.result){
						$scope.modelo.id=json.rows.id;
						$scope.modelo.tipo=json.rows.tipo;
						$scope.modelo.titulo=json.rows.titulo;
						$scope.modelo.actividad=json.rows.actividad;
						$scope.modelo.requisitos=json.rows.requisitos;
						$scope.modelo.estado=json.rows.estado;
						$scope.modelo.fecha=json.rows.fecha;
						$scope.modelo.archivos=json.rows.archivos;
						$scope.displayFalse();
						$scope.forms.actividadVisualizar.display=true;
					}});
			},
			modificarActividad:(k)=>{
				if(confirm('¿Esta seguro que desea modificar este registro?')){
					$scope.modelo.key=k;
					$scope.modelo.id=$scope.lista[k].id;
					$scope.displayFalse();
					$scope.statusbar.display=true;
					$scope.statusbar.progress=100;
					$http
						.get($scope.routes.get.actividad+$scope.modelo.id)
						.error(()=>{console.log($scope.routes.get.actividad+$scope.modelo.id+' : No Data');})
						.success((json)=>{if(json.result){
							$scope.displayFalse();
							$scope.modelo=json.rows;
							$scope.forms.actividadModificar.display=true;
						}});
				}
			},
			activarActividad:(k)=>{
				if(confirm('¿Esta seguro que desea activar/desactivar este registro?')){
					$scope.modelo.key=k;
					$scope.modelo.id=$scope.lista[k].id
					$scope.displayFalse();
					$scope.statusbar.display=true;
					$scope.statusbar.progress=100;
					uri = $scope.routes.put.actividad+$scope.modelo.id+'/activar';
					$http
						.put(uri)
						.error(()=>{console.log(uri+' : No Data');})
						.success((json)=>{if(json.result)$scope.listaReset();});					
				}
			},
			eliminarActividad:(k)=>{
				if(confirm('¿Esta seguro que desea eliminar este registro?')){
					$scope.modelo.key=k;
					$scope.modelo.id=$scope.lista[k].id
					$scope.displayFalse();
					$scope.statusbar.display=true;
					$scope.statusbar.progress=100;
					uri = $scope.routes.delete.actividad+$scope.modelo.id;
					$http
						.delete(uri)
						.error(()=>{console.log(uri+' : No Data')})
						.success((json)=>{if(json.result)$scope.listaReset();});					
				}
			}
		},
	};

	$scope.upload = ()=>{
		input = document.getElementById('archivos');
		input.addEventListener('change',()=>{
			for(i=0;i<input.files.length;i++){
				type = input.files[i].type;
				if(type.toString().substring(0,5)==='image'){
					reader = new FileReader();
					reader.onload = (img)=>{

						// Crear una imagen.
						image = new Image();
						image.src = img.target.result.toString();
						
						// Ancho y alto relativo a la imagen.
						width   = 450;
						height  = parseInt(((parseInt(((100*width)/image.width))) *image.height) /100);
						
						// Crear elemnto canvas.
						canvas  = document.createElement('canvas');
						canvas.width = width;
						canvas.height=height;

						// Dibujar en el contexto2d una nueva imagen.
						context = canvas.getContext('2d');
						context.drawImage(image,0,0,width,height);

						$scope.modelo.archivos.push({
							id:null,
							archivo:canvas.toDataURL('image/jpg',0.8).toString(),
							tipo:type,
							resource:'local'
						});

						$scope.$apply();
					};
					reader.readAsDataURL(input.files[i]);
				}
			}
			input.value='';
		})
		input.click();
	};

	$scope.delete=(key)=>{
		if(confirm('¿Esta seguro de que desea eliminar este archivo?')){
			if($scope.modelo.archivos[key].resource==='local'){
				$scope.modelo.archivos.splice(key,1);
			}
			if($scope.modelo.archivos[key].resource==='remote'){
				id  = $scope.modelo.archivos[key].id;
				uri = $scope.routes.delete.archivo+id;
				$http
					.delete(uri)
					.error(()=>{console.log(uri+' : No Data');})
					.success((json)=>{if(json.result){
						$scope.modelo.archivos.splice(key,1);
					}});
			}
		}
		
	};

	$scope.displayFalse = ()=>{
		$scope.statusbar.display=false;
		$scope.forms.actividadNuevo.display=false;
		$scope.forms.actividadModificar.display=false;
		$scope.forms.actividadVisualizar.display=false;
		$scope.forms.actividadListar.display=false;
	};

	$scope.listaReset = ()=>{
		$scope.displayFalse();
		uri = $scope.routes.get.actividades;
		$http
			.get(uri)
			.error(()=>{console.log(uri+' : No Data');})
			.success((json)=>{
				if(json.result){
					$scope.lista=json.rows;
					$scope.forms.actividadListar.display=true;
				}
			});
	};

	$scope.init = ()=>{
		data = $session.get('user');
		$scope.user = JSON.parse(data);
		$rootScope.usuario = $scope.user.usuario;
		$rootScope.stage=true;
		$scope.listaReset();
	};

	$session.autorize(()=>{
		$scope.init();
	});	

});