angular
    .module('legapp')
    .controller('actividadController', function($scope, $rootScope, $http, $session) {

        $scope.routes = {
            get: {
                actividades: '/rest/ful/adminadd/index.php/actividades',
                actividad: '/rest/ful/adminadd/index.php/actividad/'
            },
            post: {
                actividad: '/rest/ful/adminadd/index.php/actividad'
            },
            put: {
                actividad: '/rest/ful/adminadd/index.php/actividad/'
            },
            delete: {
                actividad: '/rest/ful/adminadd/index.php/actividad/',
                archivo: '/rest/ful/adminadd/index.php/actividad/archivo/'
            }
        };

        $scope.modelo = {
            key: '',
            id: '',
            titulo: '',
            actividad: '',
            requisitos: '',
            estado: '',
            fecha: '',
            archivos: []
        };

        $scope.lista = [];

        $scope.statusbar = {
            display: false,
            progress: '0'
        };

        $scope.forms = {
            actividadNuevo: {
                display: false,
                cancelar: function() {
                    $scope.modelo.key = null;
                    $scope.modelo.id = null;
                    $scope.displayFalse();
                    $scope.forms.actividadListar.display = true;
                },
                aceptar: function() {
                    $scope.displayFalse();
                    $session.autorize(() => {
                        $http
                            .post($scope.routes.post.actividad, $scope.modelo)
                            .success(function() { $scope.listaReset(); });
                    });
                    $scope.forms.actividadListar.display = true;
                }
            },
            actividadModificar: {
                display: false,
                cancelar: function() {
                    $scope.modelo.id = null;
                    $scope.displayFalse();
                    $scope.forms.actividadListar.display = true;
                },
                aceptar: function() {
                    $scope.displayFalse();
                    uri = $scope.routes.put.actividad + $scope.modelo.id;
                    $http
                        .put(uri, $scope.modelo)
                        .success(function() { $scope.listaReset(); });
                }
            },
            actividadVisualizar: {
                display: false,
                aceptar: function() { $scope.listaReset(); },

            },
            actividadListar: {
                display: false,
                nuevaActividad: function() {
                    d = new Date();
                    $scope.displayFalse();
                    $scope.modelo.id = '';
                    $scope.modelo.titulo = '';
                    $scope.modelo.actividad = '';
                    $scope.modelo.requisitos = '';
                    $scope.modelo.estado = 'INACTIVO';
                    $scope.modelo.fecha = '';
                    $scope.modelo.fecha += d.getFullYear().toString() + '-';
                    $scope.modelo.fecha += (d.getMonth() + 1).toString() + '-';
                    $scope.modelo.fecha += d.getDate().toString() + ' ';
                    $scope.modelo.fecha += d.getHours().toString() + ':';
                    $scope.modelo.fecha += d.getMinutes().toString() + ':';
                    $scope.modelo.fecha += d.getSeconds().toString();
                    $scope.modelo.archivos = [];
                    $scope.forms.actividadNuevo.display = true;
                },
                visualizarActividad: (k) => {
                    id = $scope.lista[k].id;
                    $scope.displayFalse();
                    $scope.statusbar.display = true;
                    $scope.statusbar.progress = 100;
                    $http
                        .get($scope.routes.get.actividad + id)
                        .success(function(json) {
                            if (json.result === true) {
                                $scope.modelo.id = json.rows.id;
                                $scope.modelo.tipo = json.rows.tipo;
                                $scope.modelo.titulo = json.rows.titulo;
                                $scope.modelo.actividad = json.rows.actividad;
                                $scope.modelo.requisitos = json.rows.requisitos;
                                $scope.modelo.estado = json.rows.estado;
                                $scope.modelo.fecha = json.rows.fecha;
                                $scope.modelo.archivos = json.rows.archivos;
                                $scope.displayFalse();
                                $scope.forms.actividadVisualizar.display = true;
                            }
                        });
                },
                modificarActividad: (k) => {
                    if (confirm('¿Esta seguro que desea modificar este registro?')) {
                        $scope.modelo.key = k;
                        $scope.modelo.id = $scope.lista[k].id;
                        $scope.displayFalse();
                        $scope.statusbar.display = true;
                        $scope.statusbar.progress = 100;
                        $http
                            .get($scope.routes.get.actividad + $scope.modelo.id)
                            .success(function(json) {
                                if (json.result === true) {
                                    $scope.displayFalse();
                                    $scope.modelo = json.rows;
                                    $scope.forms.actividadModificar.display = true;
                                }
                            });
                    }
                },
                activarActividad: function(k) {
                    if (confirm('¿Esta seguro que desea activar/desactivar este registro?')) {
                        $scope.modelo.key = k;
                        $scope.modelo.id = $scope.lista[k].id
                        $scope.displayFalse();
                        $scope.statusbar.display = true;
                        $scope.statusbar.progress = 100;
                        uri = $scope.routes.put.actividad + $scope.modelo.id + '/activar';
                        $http
                            .put(uri)
                            .success(function(json) { if (json.result) $scope.listaReset(); });
                    }
                },
                eliminarActividad: function(k) {
                    if (confirm('¿Esta seguro que desea eliminar este registro?')) {
                        $scope.modelo.key = k;
                        $scope.modelo.id = $scope.lista[k].id
                        $scope.displayFalse();
                        $scope.statusbar.display = true;
                        $scope.statusbar.progress = 100;
                        uri = $scope.routes.delete.actividad + $scope.modelo.id;
                        $http
                            .delete(uri)
                            .success(function(json) { if (json.result) $scope.listaReset(); });
                    }
                }
            },
        };

        $scope.upload = function() {
            input = document.createElement('input');
            input.multiple = false;
            input.type = 'file';
            input.lang = 'es';
            input.accept = 'image/*';
            input.click();
            input.addEventListener('change', function() {
                for (i = 0; i < input.files.length; i++) {
                    file = input.files[i];
                    type = file.type;
                    if (type.toString().substring(0, 5) === 'image') {
                        reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.addEventListener('loadend', (object) => {
                            if (reader.readyState === 2) {
                                img = document.createElement('img');
                                img.src = reader.result;
                                img.addEventListener('load', () => {
                                    canvas = document.createElement('canvas');
                                    canvas.width = 450;
                                    canvas.height = parseInt(((parseInt(((100 * canvas.width) / img.width))) * img.height) / 100);
                                    context = canvas.getContext('2d');
                                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    $scope.modelo.archivos.push({
                                        id: null,
                                        archivo: canvas.toDataURL(type, 0.8),
                                        tipo: type,
                                        resource: 'local'
                                    });
                                    $scope.$apply();
                                });
                            }
                        });
                    }
                }
            });
        };

        $scope.delete = function(key) {
            if (confirm('¿Esta seguro de que desea eliminar este archivo?')) {
                if ($scope.modelo.archivos[key].resource === 'local') $scope.modelo.archivos.splice(key, 1);
                if ($scope.modelo.archivos[key].resource === 'remote') {
                    id = $scope.modelo.archivos[key].id;
                    uri = $scope.routes.delete.archivo + id;
                    $http
                        .delete(uri)
                        .success(function(json) { $scope.modelo.archivos.splice(key, 1); });
                }
            }

        };

        $scope.displayFalse = function() {
            $scope.statusbar.display = false;
            $scope.forms.actividadNuevo.display = false;
            $scope.forms.actividadModificar.display = false;
            $scope.forms.actividadVisualizar.display = false;
            $scope.forms.actividadListar.display = false;
        };

        $scope.listaReset = function() {
            $scope.displayFalse();
            uri = $scope.routes.get.actividades;
            $http
                .get(uri)
                .success(function(json) {
                    if (json.result === true) $scope.forms.actividadListar.display = true;
                    $scope.lista = json.rows;
                });
        };

        $scope.init = function() {
            $session.init();
            $scope.listaReset();
        };

        $scope.init();

    });