# Desafio Base de datos

## Coder

## Manual de instalacion

- MySQL con Docker

  > Es necesario contar con la instalacion de aplicacion Docker para poder levantar MySQL dentro del container. Los pasos a seguir son:
  > Descargar la imagen de MySQL desde DockerHub con el commando 
  > `docker pull mysql`
  > Una vez realizado iniciar el container con el siguiente commando 
  > `docker run --name coder-mysql -e MYSQL_ROOT_PASSWORD=admin -d mysql:latestdocker run --name coder-mysql -p 3306:3306 -d mysql:late`
  > Esto nos iniciara el container de MySQL con la pass de root escrita en el commando.
  > Listo! MySQL esta listo para que se conecte con cualquier tool de administracion. 