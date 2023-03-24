import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {RolMenuRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(RolMenuRepository)
    private repositorioRolMenu: RolMenuRepository
  ) {}

  async VerificarPermisoDeUsuarioPorRol(idRol: string, idMenu: string, accion: string): Promise<UserProfile | undefined> {
    let permiso = await this.repositorioRolMenu.findOne({
      where:{
        rolId: idRol,
        menuId: idMenu
      }
    });
    let continuar: boolean = false;
    if (permiso) {
      switch (accion) {
        case "guardar":
          continuar = permiso.guardar;
        case "editar":
          continuar = permiso.editar;
        case "listar":
          continuar = permiso.listar;
        case "eliminar":
          continuar = permiso.eliminar;
        case "descargar":
          continuar = permiso.descargar;
        break;

        default:
          throw new HttpErrors[401]("No es posible ejecutar la acción porque no existe.");
        }
        if (continuar) {
          let perfil: UserProfile = Object.assign({
            permitido: "OK"
          });
          return perfil;
        } else {
          return undefined;
        }
      } else {
        throw new HttpErrors[401]("No es posible ejecutar la acción por falta de permisos.");
      }
  }
}
