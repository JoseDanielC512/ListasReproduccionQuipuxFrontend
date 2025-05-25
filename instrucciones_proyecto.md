**Guía Detallada para Implementación de API de Listas de Reproducción**
=======================================================================

**1. Introducción y Alcance**
-----------------------------

Este documento describe los pasos detallados para implementar una API
REST para la gestión de listas de reproducción y canciones. La API
permitirá operaciones CRUD para ambas entidades, implementará
autenticación y autorización basada en roles utilizando JWT, y
persistirá los datos en una base de datos en memoria H2.

**Tecnologías Principales:**

-   Java 17

-   Spring Boot 3.X.X

-   Maven

-   Spring Data JPA

-   Spring Security (con JWT)

-   H2 Database

-   Lombok (opcional, pero recomendado)

-   Bean Validation

**2. Configuración del Proyecto con Spring Initializr**
-------------------------------------------------------

1.  **Visita Spring Initializr:**
    > [*start.spring.io*](https://start.spring.io/)

2.  **Configuración del Proyecto:**

    -   **Project:** Maven

    -   **Language:** Java

    -   **Spring Boot:** Selecciona la última versión estable (ej. 3.2.x
        > o superior).

    -   **Project Metadata:**

        -   **Group:** com.example

        -   **Artifact:** playlist-api

        -   **Name:** playlist-api

        -   **Description:** API para gestionar listas de reproducción y
            > canciones

        -   **Package name:** com.example.playlistapi

        -   **Packaging:** Jar

        -   **Java:** 17

3.  **Dependencias:**

    -   **Spring Web:** Para construir APIs RESTful.

    -   **Spring Data JPA:** Para la capa de persistencia.

    -   **H2 Database:** Base de datos en memoria.

    -   **Spring Security:** Para autenticación y autorización.

    -   **Lombok:** Para reducir código boilerplate (getters, setters,
        > etc.).

    -   **Validation:** Para usar Bean Validation API (ej. @NotNull).

    -   **Java JWT (io.jsonwebtoken):** Necesitarás añadir estas
        > dependencias manualmente al pom.xml para JWT.\
        > <dependency>\
        > <groupId>io.jsonwebtoken</groupId>\
        > <artifactId>jjwt-api</artifactId>\
        > <version>0.11.5</version> </dependency>\
        > <dependency>\
        > <groupId>io.jsonwebtoken</groupId>\
        > <artifactId>jjwt-impl</artifactId>\
        > <version>0.11.5</version>
        > <scope>runtime</scope>\
        > </dependency>\
        > <dependency>\
        > <groupId>io.jsonwebtoken</groupId>\
        > <artifactId>jjwt-jackson</artifactId>
        > <version>0.11.5</version>
        > <scope>runtime</scope>\
        > </dependency>

4.  **Genera y Descarga:** Haz clic en "GENERATE" y descarga el archivo
    > ZIP.

5.  **Importa:** Descomprime e importa el proyecto en tu IDE (IntelliJ
    > IDEA, Eclipse, VSCode).

**3. Estructura de Carpetas del Proyecto**
------------------------------------------

La estructura de paquetes sugerida dentro de
src/main/java/com/example/playlistapi/ será:

-   config/: Clases de configuración (ej. SecurityConfig).

-   controller/: Controladores REST (ej. ListaReproduccionController,
    > CancionController, AuthController).

-   dto/: Objetos de Transferencia de Datos (ej. ListaReproduccionRequestDto, CancionDto,
    > AuthRequestDto, ErrorResponseDto).

-   entity/: Entidades JPA (ej. ListaReproduccion, Cancion).

-   exception/: Clases de excepción personalizadas y manejadores
    > globales (ej. ResourceNotFoundException, GlobalExceptionHandler).

-   repository/: Interfaces de Spring Data JPA (ej. ListaReproduccionRepository,
    > CancionRepository).

-   security/: Componentes relacionados con Spring Security y JWT (ej.
    > JwtUtil, JwtRequestFilter, UserDetailsServiceImpl).

-   service/: Lógica de negocio (ej. ListaReproduccionService, CancionService).

-   PlaylistApiApplication.java: Clase principal de Spring Boot.

**4. Configuración de la Base de Datos (H2)**
---------------------------------------------

Edita el archivo src/main/resources/application.properties:

\# Server Configuration\
server.port=8080\
\
\# H2 Database Configuration\
spring.h2.console.enabled=true\
spring.h2.console.path=/h2-console\
spring.datasource.url=jdbc:h2:mem:playlistdb;DB\_CLOSE\_DELAY=-1\
spring.datasource.driverClassName=org.h2.Driver\
spring.datasource.username=sa\
spring.datasource.password=password \# Puedes dejarlo en blanco o
cambiarlo\
\
\# JPA Configuration\
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect\
spring.jpa.hibernate.ddl-auto=update \# 'update' para desarrollo,
'validate' para producción, 'create-drop' si quieres que se reinicie en
cada ejecución.\
spring.jpa.show-sql=true \# Útil para depuración, muestra las queries
SQL generadas\
\
\# Spring Security Users (in-memory) - Para ser leídos por
UserDetailsServiceImpl\
app.security.users.admin.username=admin\
app.security.users.admin.password=adminpass \# Se codificará con BCrypt
en la configuración\
app.security.users.admin.roles=ADMIN\
app.security.users.user.username=user\
app.security.users.user.password=userpass \# Se codificará con BCrypt en
la configuración\
app.security.users.user.roles=USER\
\
\# JWT Configuration\
jwt.secret=YourVeryLongAndSecureSecretKeyForJWTHS512EncodingAndDecodingPlaylistsApiProject
\# ¡CAMBIAR ESTO POR UNA CLAVE SECRETA REAL Y SEGURA!\
jwt.expiration.ms=3600000 \# 1 hora en milisegundos (3600 \* 1000)\
jwt.header=Authorization\
jwt.prefix=Bearer

**5. Definición de Entidades JPA**
----------------------------------

Ubicación: src/main/java/com/example/playlistapi/entity/

### **5.1. Cancion.java**

package com.example.playlistapi.entity;\
\
import jakarta.persistence.\*;\
import jakarta.validation.constraints.NotBlank; // Usar NotBlank para
Strings en lugar de NotNull si no deben ser solo espacios en blanco\
import jakarta.validation.constraints.NotNull;\
import lombok.Data;\
import lombok.NoArgsConstructor;\
import lombok.AllArgsConstructor;\
\
import java.util.HashSet;\
import java.util.Set;\
\
@Entity\
@Table(name = "songs")\
@Data\
@NoArgsConstructor\
@AllArgsConstructor\
public class Cancion {\
\
@Id\
@GeneratedValue(strategy = GenerationType.IDENTITY)\
private Long id;\
\
@NotBlank(message = "El título no puede estar vacío ni ser nulo.")\
@Column(nullable = false)\
private String titulo;\
\
@NotBlank(message = "El artista no puede estar vacío ni ser nulo.")\
@Column(nullable = false)\
private String artista;\
\
@NotBlank(message = "El álbum no puede estar vacío ni ser nulo.")\
@Column(nullable = false)\
private String album;\
\
@NotBlank(message = "El año no puede estar vacío ni ser nulo.") //
Considerar Integer si siempre es numérico\
@Column(nullable = false)\
private String anno; // O Integer\
\
@NotBlank(message = "El género no puede estar vacío ni ser nulo.")\
@Column(nullable = false)\
private String genero;\
\
@ManyToMany(mappedBy = "canciones")\
private Set<ListaReproduccion> playlists = new HashSet<>();\
\
// Evitar recursión infinita en toString si se usa Lombok @Data con
relaciones bidireccionales\
@Override\
public String toString() {\
return "Cancion{" +\
"id=" + id +\
", titulo='" + titulo + '\\'' +\
", artista='" + artista + '\\'' +\
", album='" + album + '\\'' +\
", anno='" + anno + '\\'' +\
", genero='" + genero + '\\'' +\
'}';\
}\
\
@Override\
public int hashCode() {\
return id != null ? id.hashCode() : 0;\
}\
\
@Override\
public boolean equals(Object o) {\
if (this == o) return true;\
if (o == null || getClass() != o.getClass()) return false;\
Cancion song = (Cancion) o;\
return id != null && id.equals(song.id);\
}\
}

### **5.2. ListaReproduccion.java**

package com.example.playlistapi.entity;\
\
import jakarta.persistence.\*;\
import jakarta.validation.constraints.NotBlank;\
import lombok.Data;\
import lombok.NoArgsConstructor;\
import lombok.AllArgsConstructor;\
\
import java.util.HashSet;\
import java.util.Set;\
\
@Entity\
@Table(name = "playlists")\
@Data\
@NoArgsConstructor\
@AllArgsConstructor\
public class ListaReproduccion {\
\
@Id\
@GeneratedValue(strategy = GenerationType.IDENTITY)\
private Long id;\
\
@NotBlank(message = "El nombre de la lista no puede estar vacío ni ser
nulo.")\
@Column(nullable = false, unique = true)\
private String nombre;\
\
@Column // La descripción puede ser nula\
private String descripcion;\
\
@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
CascadeType.MERGE })\
@JoinTable(\
name = "playlist\_songs",\
joinColumns = @JoinColumn(name = "playlist\_id"),\
inverseJoinColumns = @JoinColumn(name = "song\_id")\
)\
private Set<Cancion> canciones = new HashSet<>();\
\
// Método helper para añadir canciones\
public void addSong(Cancion song) {\
this.canciones.add(song);\
song.getPlaylists().add(this);\
}\
\
// Método helper para remover canciones\
public void removeSong(Cancion song) {\
this.canciones.remove(song);\
song.getPlaylists().remove(this);\
}\
\
// Evitar recursión infinita en toString si se usa Lombok @Data con
relaciones bidireccionales\
@Override\
public String toString() {\
return "ListaReproduccion{" +\
"id=" + id +\
", nombre='" + nombre + '\\'' +\
", descripcion='" + descripcion + '\\'' +\
'}';\
}\
\
@Override\
public int hashCode() {\
return id != null ? id.hashCode() : 0;\
}\
\
@Override\
public boolean equals(Object o) {\
if (this == o) return true;\
if (o == null || getClass() != o.getClass()) return false;\
ListaReproduccion playlist = (ListaReproduccion) o;\
return id != null && id.equals(playlist.id);\
}\
}

**6. Definición de Repositorios Spring Data JPA**
-------------------------------------------------

Ubicación: src/main/java/com/example/playlistapi/repository/

### **6.1. CancionRepository.java**

package com.example.playlistapi.repository;\
\
import com.example.playlistapi.entity.Cancion;\
import org.springframework.data.jpa.repository.JpaRepository;\
import org.springframework.stereotype.Repository;\
\
@Repository\
public interface CancionRepository extends JpaRepository<Cancion, Long>
{\
// Métodos de búsqueda personalizados si son necesarios\
}

### **6.2. ListaReproduccionRepository.java**

package com.example.playlistapi.repository;\
\
import com.example.playlistapi.entity.ListaReproduccion;\
import org.springframework.data.jpa.repository.JpaRepository;\
import org.springframework.stereotype.Repository;\
import java.util.Optional;\
\
@Repository\
public interface ListaReproduccionRepository extends JpaRepository<ListaReproduccion,
Long> {\
Optional<ListaReproduccion> findByNombre(String nombre);\
boolean existsByNombre(String nombre);\
}

**7. Data Transfer Objects (DTOs)**
-----------------------------------

Ubicación: src/main/java/com/example/playlistapi/dto/

### **7.1. CancionDto.java**

package com.example.playlistapi.dto;\
\
import jakarta.validation.constraints.NotBlank;\
import lombok.Data;\
import lombok.NoArgsConstructor;\
import lombok.AllArgsConstructor;\
\
@Data\
@NoArgsConstructor\
@AllArgsConstructor\
public class CancionDto {\
private Long id;\
\
@NotBlank(message = "El título no puede estar vacío ni ser nulo.")\
private String titulo;\
\
@NotBlank(message = "El artista no puede estar vacío ni ser nulo.")\
private String artista;\
\
@NotBlank(message = "El álbum no puede estar vacío ni ser nulo.")\
private String album;\
\
@NotBlank(message = "El año no puede estar vacío ni ser nulo.")\
private String anno;\
\
@NotBlank(message = "El género no puede estar vacío ni ser nulo.")\
private String genero;\
}

### **7.2. ListaReproduccionRequestDto.java (Para creación/actualización)**

package com.example.playlistapi.dto;\
\
import jakarta.validation.constraints.NotBlank;\
import lombok.Data;\
import lombok.NoArgsConstructor;\
import lombok.AllArgsConstructor;\
import java.util.Set;\
\
@Data\
@NoArgsConstructor\
@AllArgsConstructor\
public class ListaReproduccionRequestDto {\
@NotBlank(message = "El nombre de la lista no puede estar vacío ni ser
nulo.")\
private String nombre;\
\
private String descripcion; // Puede ser nulo\
\
private Set<Long> cancionIds; // IDs de canciones para asociar\
}

### **7.3. ListaReproduccionResponseDto.java (Para respuestas)**

package com.example.playlistapi.dto;\
\
import lombok.Data;\
import lombok.NoArgsConstructor;\
import lombok.AllArgsConstructor;\
import java.util.Set;\
\
@Data\
@NoArgsConstructor\
@AllArgsConstructor\
public class ListaReproduccionResponseDto {\
private Long id;\
private String nombre;\
private String descripcion;\
private Set<CancionDto> canciones;\
}

### **7.4. AuthRequestDto.java (Para login)**

package com.example.playlistapi.dto;\
\
import jakarta.validation.constraints.NotBlank;\
import lombok.Data;\
\
@Data\
public class AuthRequestDto {\
@NotBlank\
private String username;\
@NotBlank\
private String password;\
}

### **7.5. AuthResponseDto.java (Respuesta de login con token)**

package com.example.playlistapi.dto;\
\
import lombok.AllArgsConstructor;\
import lombok.Data;\
\
@Data\
@AllArgsConstructor\
public class AuthResponseDto {\
private String token;\
}

### **7.6. ErrorResponseDto.java (Para respuestas de error estandarizadas)**

package com.example.playlistapi.dto;\
\
import lombok.AllArgsConstructor;\
import lombok.Data;\
import java.time.LocalDateTime;\
import java.util.List;\
import java.util.Map;\
\
@Data\
@AllArgsConstructor\
public class ErrorResponseDto {\
private LocalDateTime timestamp;\
private int status;\
private String error; // ej. "Bad Request", "Not Found"\
private String message; // Mensaje general del error\
private String path; // URI donde ocurrió el error\
private Map<String, List<String>> validationErrors; // Para
errores de validación detallados\
}

**8. Implementación de la Lógica de Negocio (Capa de Servicio)**
----------------------------------------------------------------

Ubicación: src/main/java/com/example/playlistapi/service/

### **8.1. CancionService.java**

package com.example.playlistapi.service;\
\
import com.example.playlistapi.dto.CancionDto;\
import com.example.playlistapi.entity.Cancion;\
import com.example.playlistapi.exception.ResourceNotFoundException;\
import com.example.playlistapi.repository.CancionRepository;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.stereotype.Service;\
import org.springframework.transaction.annotation.Transactional;\
\
import java.util.List;\
import java.util.stream.Collectors;\
\
@Service\
public class CancionService {\
\
private final CancionRepository cancionRepository;\
\
@Autowired\
public CancionService(CancionRepository cancionRepository) {\
this.cancionRepository = cancionRepository;\
}\
\
@Transactional\
public CancionDto crearCancion(CancionDto cancionDto) {\
Cancion cancion = mapToEntity(cancionDto);\
Cancion savedCancion = cancionRepository.save(cancion);\
return mapToDto(savedCancion);\
}\
\
@Transactional(readOnly = true)\
public List<CancionDto> obtenerTodasLasCanciones() {\
return cancionRepository.findAll().stream()\
.map(this::mapToDto)\
.collect(Collectors.toList());\
}\
\
@Transactional(readOnly = true)\
public CancionDto obtenerCancionPorId(Long id) {\
Cancion cancion = cancionRepository.findById(id)\
.orElseThrow(() -> new ResourceNotFoundException("Cancion", "id",
id.toString()));\
return mapToDto(cancion);\
}\
\
@Transactional\
public CancionDto actualizarCancion(Long id, CancionDto cancionDto) {\
Cancion existingCancion = cancionRepository.findById(id)\
.orElseThrow(() -> new ResourceNotFoundException("Cancion", "id",
id.toString()));\
\
existingCancion.setTitulo(cancionDto.getTitulo());\
existingCancion.setArtista(cancionDto.getArtista());\
existingCancion.setAlbum(cancionDto.getAlbum());\
existingCancion.setAnno(cancionDto.getAnno());\
existingCancion.setGenero(cancionDto.getGenero());\
\
Cancion updatedCancion = cancionRepository.save(existingCancion);\
return mapToDto(updatedCancion);\
}\
\
@Transactional\
public void eliminarCancion(Long id) {\
if (!cancionRepository.existsById(id)) {\
throw new ResourceNotFoundException("Cancion", "id", id.toString());\
}\
// Considerar cómo manejar las listas de reproducción que contienen esta
canción.\
// Por ahora, solo se borra la canción. La relación ManyToMany se
encargará de\
// removerla de la tabla de unión.\
cancionRepository.deleteById(id);\
}\
\
// --- Mappers ---\
private CancionDto mapToDto(Cancion cancion) {\
return new CancionDto(\
cancion.getId(),\
cancion.getTitulo(),\
cancion.getArtista(),\
cancion.getAlbum(),\
cancion.getAnno(),\
cancion.getGenero()\
);\
}\
\
private Cancion mapToEntity(CancionDto cancionDto) {\
Cancion cancion = new Cancion();\
// No se setea el ID aquí, ya que es para creación o se toma del
existente para actualización\
cancion.setTitulo(cancionDto.getTitulo());\
cancion.setArtista(cancionDto.getArtista());\
cancion.setAlbum(cancionDto.getAlbum());\
cancion.setAnno(cancionDto.getAnno());\
cancion.setGenero(cancionDto.getGenero());\
return cancion;\
}\
}

### **8.2. ListaReproduccionService.java**

package com.example.playlistapi.service;\
\
import com.example.playlistapi.dto.ListaReproduccionRequestDto;\
import com.example.playlistapi.dto.ListaReproduccionResponseDto;\
import com.example.playlistapi.dto.CancionDto;\
import com.example.playlistapi.entity.ListaReproduccion;\
import com.example.playlistapi.entity.Cancion;\
import com.example.playlistapi.exception.BadRequestException;\
import com.example.playlistapi.exception.ResourceNotFoundException;\
import com.example.playlistapi.repository.ListaReproduccionRepository;\
import com.example.playlistapi.repository.CancionRepository;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.stereotype.Service;\
import org.springframework.transaction.annotation.Transactional;\
\
import java.util.HashSet;\
import java.util.List;\
import java.util.Set;\
import java.util.stream.Collectors;\
\
@Service\
public class ListaReproduccionService {\
\
private final ListaReproduccionRepository listaReproduccionRepository;\
private final CancionRepository cancionRepository;\
\
@Autowired\
public ListaReproduccionService(ListaReproduccionRepository listaReproduccionRepository,
CancionRepository cancionRepository) {\
this.listaReproduccionRepository = listaReproduccionRepository;\
this.cancionRepository = cancionRepository;\
}\
\
@Transactional\
public ListaReproduccionResponseDto crearListaReproduccion(ListaReproduccionRequestDto
listaReproduccionRequestDto) {\
if (listaReproduccionRepository.existsByNombre(listaReproduccionRequestDto.getNombre()))
{\
throw new BadRequestException("Ya existe una lista de reproducción con
el nombre: " + listaReproduccionRequestDto.getNombre());\
}\
ListaReproduccion listaReproduccion = new ListaReproduccion();\
listaReproduccion.setNombre(listaReproduccionRequestDto.getNombre());\
listaReproduccion.setDescripcion(listaReproduccionRequestDto.getDescripcion());\
\
if (listaReproduccionRequestDto.getCancionIds() != null &&
!listaReproduccionRequestDto.getCancionIds().isEmpty()) {\
Set<Cancion> canciones = new
HashSet<>(cancionRepository.findAllById(listaReproduccionRequestDto.getCancionIds()));\
if (canciones.size() != listaReproduccionRequestDto.getCancionIds().size()) {\
// Algún ID de canción no fue encontrado\
throw new ResourceNotFoundException("Cancion", "ids",
listaReproduccionRequestDto.getCancionIds().toString() + " - Algunas canciones no
fueron encontradas.");\
}\
listaReproduccion.setCanciones(canciones);\
}\
\
ListaReproduccion savedListaReproduccion = listaReproduccionRepository.save(listaReproduccion);\
return mapToResponseDto(savedListaReproduccion);\
}\
\
@Transactional\
public ListaReproduccionResponseDto crearListaReproduccionConCancion(String playlistName,
String playlistDescription, Long songId) {\
if (listaReproduccionRepository.existsByNombre(playlistName)) {\
throw new BadRequestException("Ya existe una lista de reproducción con
el nombre: " + playlistName);\
}\
Cancion cancion = cancionRepository.findById(songId)\
.orElseThrow(() -> new ResourceNotFoundException("Cancion", "id",
songId.toString()));\
\
ListaReproduccion listaReproduccion = new ListaReproduccion();\
listaReproduccion.setNombre(playlistName);\
listaReproduccion.setDescripcion(playlistDescription);\
listaReproduccion.addSong(cancion); // Usar el método helper\
\
ListaReproduccion savedListaReproduccion = listaReproduccionRepository.save(listaReproduccion);\
return mapToResponseDto(savedListaReproduccion);\
}\
\
\
@Transactional(readOnly = true)\
public List<ListaReproduccionResponseDto> obtenerTodasLasListasReproduccion() {\
return listaReproduccionRepository.findAll().stream()\
.map(this::mapToResponseDto)\
.collect(Collectors.toList());\
}\
\
@Transactional(readOnly = true)\
public ListaReproduccionResponseDto obtenerListaReproduccionPorNombre(String nombre) {\
ListaReproduccion listaReproduccion = listaReproduccionRepository.findByNombre(nombre)\
.orElseThrow(() -> new ResourceNotFoundException("ListaReproduccion",
"nombre", nombre));\
return mapToResponseDto(listaReproduccion);\
}\
\
@Transactional(readOnly = true)\
public ListaReproduccionResponseDto obtenerListaReproduccionPorId(Long id) {\
ListaReproduccion listaReproduccion = listaReproduccionRepository.findById(id)\
.orElseThrow(() -> new ResourceNotFoundException("ListaReproduccion", "id",
id.toString()));\
return mapToResponseDto(listaReproduccion);\
}\
\
@Transactional\
public ListaReproduccionResponseDto actualizarListaReproduccion(Long id, ListaReproduccionRequestDto
listaReproduccionRequestDto) {\
ListaReproduccion existingListaReproduccion = listaReproduccionRepository.findById(id)\
.orElseThrow(() -> new ResourceNotFoundException("ListaReproduccion", "id",
id.toString()));\
\
// Verificar si el nuevo nombre ya existe en otra lista\
if (!existingListaReproduccion.getNombre().equals(listaReproduccionRequestDto.getNombre())
&&\
listaReproduccionRepository.existsByNombre(listaReproduccionRequestDto.getNombre())) {\
throw new BadRequestException("Ya existe otra lista de reproducción con
el nombre: " + listaReproduccionRequestDto.getNombre());\
}\
\
existingListaReproduccion.setNombre(listaReproduccionRequestDto.getNombre());\
existingListaReproduccion.setDescripcion(listaReproduccionRequestDto.getDescripcion());\
\
// Limpiar canciones existentes y añadir las nuevas\
existingListaReproduccion.getCanciones().clear(); // O manejarlo de forma más
granular si se quiere añadir/quitar\
if (listaReproduccionRequestDto.getCancionIds() != null &&
!listaReproduccionRequestDto.getCancionIds().isEmpty()) {\
Set<Cancion> canciones = new
HashSet<>(cancionRepository.findAllById(listaReproduccionRequestDto.getCancionIds()));\
if (canciones.size() != listaReproduccionRequestDto.getCancionIds().size()) {\
throw new ResourceNotFoundException("Cancion", "ids",
listaReproduccionRequestDto.getCancionIds().toString() + " - Algunas canciones no
fueron encontradas para actualizar.");\
}\
existingListaReproduccion.setCanciones(canciones);\
}\
\
ListaReproduccion updatedListaReproduccion = listaReproduccionRepository.save(existingListaReproduccion);\
return mapToResponseDto(updatedListaReproduccion);\
}\
\
\
@Transactional\
public void eliminarListaReproduccionPorNombre(String nombre) {\
ListaReproduccion listaReproduccion = listaReproduccionRepository.findByNombre(nombre)\
.orElseThrow(() -> new ResourceNotFoundException("ListaReproduccion",
"nombre", nombre));\
// La relación ManyToMany se encargará de las entradas en la tabla de
unión.\
// Las canciones en sí no se borran.\
listaReproduccionRepository.delete(listaReproduccion);\
}\
\
@Transactional\
public void eliminarListaReproduccionPorId(Long id) {\
ListaReproduccion listaReproduccion = listaReproduccionRepository.findById(id)\
.orElseThrow(() -> new ResourceNotFoundException("ListaReproduccion", "id",
id.toString()));\
listaReproduccionRepository.delete(listaReproduccion);\
}\
\
// --- Mappers ---\
private ListaReproduccionResponseDto mapToResponseDto(ListaReproduccion playlist) {\
Set<CancionDto> songDtos = playlist.getCanciones().stream()\
.map(song -> new CancionDto(song.getId(), song.getTitulo(),
song.getArtista(), song.getAlbum(), song.getAnno(), song.getGenero()))\
.collect(Collectors.toSet());\
return new ListaReproduccionResponseDto(\
playlist.getId(),\
playlist.getNombre(),\
playlist.getDescripcion(),\
songDtos\
);\
}\
}

**9. Implementación de Controladores REST**
-------------------------------------------

Ubicación: src/main/java/com/example/playlistapi/controller/

### **9.1. CancionController.java**

package com.example.playlistapi.controller;\
\
import com.example.playlistapi.dto.CancionDto;\
import com.example.playlistapi.service.CancionService;\
import jakarta.validation.Valid;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.http.HttpStatus;\
import org.springframework.http.ResponseEntity;\
import org.springframework.security.access.prepost.PreAuthorize;\
import org.springframework.web.bind.annotation.\*;\
import
org.springframework.web.servlet.support.ServletUriComponentsBuilder;\
\
import java.net.URI;\
import java.util.List;\
\
@RestController\
@RequestMapping("/api/canciones") // Prefijo /api para diferenciar de
posibles vistas web\
public class CancionController {\
\
private final CancionService cancionService;\
\
@Autowired\
public CancionController(CancionService cancionService) {\
this.cancionService = cancionService;\
}\
\
@PostMapping\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<CancionDto> crearCancion(@Valid @RequestBody
CancionDto cancionDto) {\
CancionDto createdCancion = cancionService.crearCancion(cancionDto);\
URI location = ServletUriComponentsBuilder.fromCurrentRequest()\
.path("/{id}")\
.buildAndExpand(createdCancion.getId())\
.toUri();\
return ResponseEntity.created(location).body(createdCancion);\
}\
\
@GetMapping\
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")\
public ResponseEntity<List<CancionDto>> obtenerTodasLasCanciones() {\
return ResponseEntity.ok(cancionService.obtenerTodasLasCanciones());\
}\
\
@GetMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")\
public ResponseEntity<CancionDto> obtenerCancionPorId(@PathVariable Long id)
{\
return ResponseEntity.ok(cancionService.obtenerCancionPorId(id));\
}\
\
@PutMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<CancionDto> actualizarCancion(@PathVariable Long id,
@Valid @RequestBody CancionDto cancionDto) {\
return ResponseEntity.ok(cancionService.actualizarCancion(id, cancionDto));\
}\
\
@DeleteMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<Void> eliminarCancion(@PathVariable Long id) {\
cancionService.eliminarCancion(id);\
return ResponseEntity.noContent().build();\
}\
}

### **9.2. ListaReproduccionController.java**

package com.example.playlistapi.controller;\
\
import com.example.playlistapi.dto.ListaReproduccionRequestDto;\
import com.example.playlistapi.dto.ListaReproduccionResponseDto;\
import com.example.playlistapi.service.ListaReproduccionService;\
import jakarta.validation.Valid;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.http.HttpStatus;\
import org.springframework.http.ResponseEntity;\
import org.springframework.security.access.prepost.PreAuthorize;\
import org.springframework.web.bind.annotation.\*;\
import
org.springframework.web.servlet.support.ServletUriComponentsBuilder;\
\
import java.net.URI;\
import java.util.List;\
\
@RestController\
@RequestMapping("/api/listas") // Usar /api/listas para consistencia\
public class ListaReproduccionController {\
\
private final ListaReproduccionService listaReproduccionService;\
\
@Autowired\
public ListaReproduccionController(ListaReproduccionService listaReproduccionService) {\
this.listaReproduccionService = listaReproduccionService;\
}\
\
// Endpoint original: POST /listas\
@PostMapping\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<ListaReproduccionResponseDto> crearListaReproduccion(@Valid
@RequestBody ListaReproduccionRequestDto listaReproduccionRequestDto) {\
ListaReproduccionResponseDto createdListaReproduccion =
listaReproduccionService.crearListaReproduccion(listaReproduccionRequestDto);\
// La URI debería apuntar al recurso por ID o por nombre único. Usaremos
ID.\
URI location = ServletUriComponentsBuilder.fromCurrentRequest()\
.path("/{id}") // Asumiendo que tendremos un GET /api/listas/{id}\
.buildAndExpand(createdListaReproduccion.getId())\
.toUri();\
return ResponseEntity.created(location).body(createdListaReproduccion);\
}\
\
// Nuevo endpoint: POST /listas/{idCancion} - para crear una lista de reproducción con
una canción inicial\
// Necesitamos pasar el nombre de la lista de reproducción y descripción de alguna
forma, por ejemplo, como query params o en el body.\
// Si es en el body, el {idCancion} en el path es un poco redundante si el
body ya tiene info de la lista de reproducción.\
// Alternativa: POST /listas/con-cancion/{idCancion} y el DTO en el body\
// O, como se especificó: POST /listas/{idCancion} y ListaReproduccionRequestDto
en el body (sin cancionIds en el DTO, ya que viene en path)\
// Vamos a optar por un DTO específico para este caso o usar query
params para nombre y descripción.\
// Para simplicidad y seguir el ejemplo "POST: /listas/{idCancion}",
asumiremos que el nombre y descripción vienen en el body.\
// Necesitaremos un DTO que no incluya \`cancionIds\` pero sí nombre y
descripción.\
// O modificar ListaReproduccionRequestDto para que cancionIds sea opcional y se
ignore si se usa este endpoint.\
\
// Opción: Usar un DTO simple para nombre y descripción, y el idCancion del
path.\
static class CrearListaReproduccionConCancionRequest {\
@Valid\
private NombreDescripcionListaDto details;\
public NombreDescripcionListaDto getDetails() { return details; }\
public void setDetails(NombreDescripcionListaDto details) { this.details =
details; }\
}\
static class NombreDescripcionListaDto {\
@jakarta.validation.constraints.NotBlank\
private String nombre;\
private String descripcion;\
public String getNombre() { return nombre; }\
public void setNombre(String nombre) { this.nombre = nombre; }\
public String getDescripcion() { return descripcion; }\
public void setDescripcion(String descripcion) { this.descripcion =
descripcion; }\
}\
\
@PostMapping("/con-cancion-inicial/{idCancion}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<ListaReproduccionResponseDto>
crearListaReproduccionConCancionInicial(\
@PathVariable Long idCancion,\
@Valid @RequestBody NombreDescripcionListaDto listaDetails) {\
ListaReproduccionResponseDto createdListaReproduccion =
listaReproduccionService.crearListaReproduccionConCancion(\
listaDetails.getNombre(),\
listaDetails.getDescripcion(),\
idCancion\
);\
URI location = ServletUriComponentsBuilder.fromCurrentRequest()\
.path("/../{id}") // Navega un nivel arriba y luego al ID\
.buildAndExpand(createdListaReproduccion.getId())\
.normalize() // Importante para limpiar la URI\
.toUri();\
return ResponseEntity.created(location).body(createdListaReproduccion);\
}\
\
\
@GetMapping\
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")\
public ResponseEntity<List<ListaReproduccionResponseDto>>
obtenerTodasLasListasReproduccion() {\
return ResponseEntity.ok(listaReproduccionService.obtenerTodasLasListasReproduccion());\
}\
\
// Endpoint original: GET /listas/{nombreLista}\
@GetMapping("/porNombre/{nombreLista}")\
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")\
public ResponseEntity<ListaReproduccionResponseDto>
obtenerListaReproduccionPorNombre(@PathVariable String nombreLista) {\
return
ResponseEntity.ok(listaReproduccionService.obtenerListaReproduccionPorNombre(nombreLista));\
}\
\
// Endpoint adicional para obtener por ID (más común en APIs REST)\
@GetMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")\
public ResponseEntity<ListaReproduccionResponseDto>
obtenerListaReproduccionPorId(@PathVariable Long id) {\
return ResponseEntity.ok(listaReproduccionService.obtenerListaReproduccionPorId(id));\
}\
\
@PutMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<ListaReproduccionResponseDto>
actualizarListaReproduccion(@PathVariable Long id, @Valid @RequestBody
ListaReproduccionRequestDto listaReproduccionRequestDto) {\
ListaReproduccionResponseDto updatedListaReproduccion = listaReproduccionService.actualizarListaReproduccion(id,
listaReproduccionRequestDto);\
return ResponseEntity.ok(updatedListaReproduccion);\
}\
\
// Endpoint original: DELETE /listas/{nombreLista}\
@DeleteMapping("/porNombre/{nombreLista}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<Void> eliminarListaReproduccionPorNombre(@PathVariable
String nombreLista) {\
listaReproduccionService.eliminarListaReproduccionPorNombre(nombreLista);\
return ResponseEntity.noContent().build();\
}\
\
// Endpoint adicional para borrar por ID\
@DeleteMapping("/{id}")\
@PreAuthorize("hasRole('ADMIN')")\
public ResponseEntity<Void> eliminarListaReproduccionPorId(@PathVariable Long
id) {\
listaReproduccionService.eliminarListaReproduccionPorId(id);\
return ResponseEntity.noContent().build();\
}\
}

**10. Manejo Global de Excepciones**
------------------------------------

Ubicación: src/main/java/com/example/playlistapi/exception/

### **10.1. Excepciones Personalizadas**

-   ResourceNotFoundException.java

package com.example.playlistapi.exception;\
\
import org.springframework.http.HttpStatus;\
import org.springframework.web.bind.annotation.ResponseStatus;\
\
@ResponseStatus(HttpStatus.NOT\_FOUND)\
public class ResourceNotFoundException extends RuntimeException {\
public ResourceNotFoundException(String resourceName, String fieldName,
String fieldValue) {\
super(String.format("%s no encontrada con %s : '%s'", resourceName,
fieldName, fieldValue));\
}\
}

-   BadRequestException.java

package com.example.playlistapi.exception;\
\
import org.springframework.http.HttpStatus;\
import org.springframework.web.bind.annotation.ResponseStatus;\
\
@ResponseStatus(HttpStatus.BAD\_REQUEST)\
public class BadRequestException extends RuntimeException {\
public BadRequestException(String message) {\
super(message);\
}\
}

### **10.2. GlobalExceptionHandler.java**

package com.example.playlistapi.exception;\
\
import com.example.playlistapi.dto.ErrorResponseDto;\
import jakarta.servlet.http.HttpServletRequest;\
import org.springframework.dao.DataIntegrityViolationException;\
import org.springframework.http.HttpStatus;\
import org.springframework.http.ResponseEntity;\
import org.springframework.security.access.AccessDeniedException;\
import
org.springframework.security.authentication.BadCredentialsException;\
import org.springframework.validation.FieldError;\
import org.springframework.web.bind.MethodArgumentNotValidException;\
import org.springframework.web.bind.annotation.ControllerAdvice;\
import org.springframework.web.bind.annotation.ExceptionHandler;\
\
import java.time.LocalDateTime;\
import java.util.HashMap;\
import java.util.List;\
import java.util.Map;\
import java.util.stream.Collectors;\
\
@ControllerAdvice\
public class GlobalExceptionHandler {\
\
@ExceptionHandler(ResourceNotFoundException.class)\
public ResponseEntity<ErrorResponseDto>
handleResourceNotFoundException(ResourceNotFoundException ex,
HttpServletRequest request) {\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.NOT\_FOUND.value(),\
"Not Found",\
ex.getMessage(),\
request.getRequestURI(),\
null\
);\
return new ResponseEntity<>(errorResponse,
HttpStatus.NOT\_FOUND);\
}\
\
@ExceptionHandler(BadRequestException.class)\
public ResponseEntity<ErrorResponseDto>
handleBadRequestException(BadRequestException ex, HttpServletRequest
request) {\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.BAD\_REQUEST.value(),\
"Bad Request",\
ex.getMessage(),\
request.getRequestURI(),\
null\
);\
return new ResponseEntity<>(errorResponse,
HttpStatus.BAD\_REQUEST);\
}\
\
@ExceptionHandler(MethodArgumentNotValidException.class)\
public ResponseEntity<ErrorResponseDto>
handleValidationExceptions(MethodArgumentNotValidException ex,
HttpServletRequest request) {\
Map<String, List<String>> errors =
ex.getBindingResult().getFieldErrors().stream()\
.collect(Collectors.groupingBy(FieldError::getField,\
Collectors.mapping(FieldError::getDefaultMessage,
Collectors.toList())));\
\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.BAD\_REQUEST.value(),\
"Validation Error",\
"La validación de los datos de entrada falló.",\
request.getRequestURI(),\
errors\
);\
return new ResponseEntity<>(errorResponse,
HttpStatus.BAD\_REQUEST);\
}\
\
@ExceptionHandler(DataIntegrityViolationException.class)\
public ResponseEntity<ErrorResponseDto>
handleDataIntegrityViolationException(DataIntegrityViolationException
ex, HttpServletRequest request) {\
String message = "Error de integridad de datos. Podría ser debido a una
restricción única violada (ej. nombre de lista duplicado).";\
// Podrías intentar analizar ex.getCause() o ex.getMostSpecificCause()
para un mensaje más específico\
if (ex.getMostSpecificCause().getMessage().contains("UNIQUE\_")) { //
Específico de H2, puede variar\
message = "Error de integridad de datos: Ya existe un recurso con un
valor único proporcionado (ej. nombre de lista duplicado).";\
}\
\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.CONFLICT.value(), // 409 Conflict es más apropiado para
violaciones de unicidad\
"Data Integrity Violation",\
message,\
request.getRequestURI(),\
null\
);\
return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);\
}\
\
@ExceptionHandler(BadCredentialsException.class)\
public ResponseEntity<ErrorResponseDto>
handleBadCredentialsException(BadCredentialsException ex,
HttpServletRequest request) {\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.UNAUTHORIZED.value(),\
"Unauthorized",\
"Credenciales inválidas.",\
request.getRequestURI(),\
null\
);\
return new ResponseEntity<>(errorResponse,
HttpStatus.UNAUTHORIZED);\
}\
\
@ExceptionHandler(AccessDeniedException.class)\
public ResponseEntity<ErrorResponseDto>
handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest
request) {\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.FORBIDDEN.value(),\
"Forbidden",\
"No tiene permiso para acceder a este recurso.",\
request.getRequestURI(),\
null\
);\
return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);\
}\
\
@ExceptionHandler(Exception.class) // Manejador genérico para cualquier
otra excepción no capturada\
public ResponseEntity<ErrorResponseDto>
handleGlobalException(Exception ex, HttpServletRequest request) {\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.INTERNAL\_SERVER\_ERROR.value(),\
"Internal Server Error",\
"Ocurrió un error inesperado: " + ex.getMessage(),\
request.getRequestURI(),\
null\
);\
// Loggear la excepción completa para depuración\
// logger.error("Error inesperado: ", ex);\
return new ResponseEntity<>(errorResponse,
HttpStatus.INTERNAL\_SERVER\_ERROR);\
}\
}

**11. Implementación de Seguridad con Spring Security y JWT**
-------------------------------------------------------------

### **11.1. UserDetailsServiceImpl.java (Para cargar usuarios desde properties)**

Ubicación: src/main/java/com/example/playlistapi/security/

package com.example.playlistapi.security;\
\
import org.springframework.beans.factory.annotation.Value;\
import org.springframework.context.annotation.Bean;\
import org.springframework.security.core.GrantedAuthority;\
import
org.springframework.security.core.authority.SimpleGrantedAuthority;\
import org.springframework.security.core.userdetails.User;\
import org.springframework.security.core.userdetails.UserDetails;\
import
org.springframework.security.core.userdetails.UserDetailsService;\
import
org.springframework.security.core.userdetails.UsernameNotFoundException;\
import
org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\
import org.springframework.security.crypto.password.PasswordEncoder;\
import org.springframework.stereotype.Service;\
\
import java.util.Arrays;\
import java.util.List;\
import java.util.stream.Collectors;\
\
@Service\
public class UserDetailsServiceImpl implements UserDetailsService {\
\
// Inyectar valores desde application.properties\
@Value("\${app.security.users.admin.username}")\
private String adminUsername;\
@Value("\${app.security.users.admin.password}")\
private String adminPassword; // Este será el password en texto plano de
properties\
@Value("\${app.security.users.admin.roles}")\
private String adminRoles; // "ADMIN" o "ROLE\_ADMIN"\
\
@Value("\${app.security.users.user.username}")\
private String regularUsername;\
@Value("\${app.security.users.user.password}")\
private String regularPassword;\
@Value("\${app.security.users.user.roles}")\
private String regularRoles; // "USER" o "ROLE\_USER"\
\
private final PasswordEncoder passwordEncoder;\
\
public UserDetailsServiceImpl(PasswordEncoder passwordEncoder) {\
this.passwordEncoder = passwordEncoder;\
}\
\
@Override\
public UserDetails loadUserByUsername(String username) throws
UsernameNotFoundException {\
if (adminUsername.equals(username)) {\
return new User(adminUsername,\
passwordEncoder.encode(adminPassword), // Codificar la contraseña de
properties\
getAuthorities(adminRoles));\
} else if (regularUsername.equals(username)) {\
return new User(regularUsername,\
passwordEncoder.encode(regularPassword),\
getAuthorities(regularRoles));\
} else {\
throw new UsernameNotFoundException("Usuario no encontrado: " +
username);\
}\
}\
\
private List<GrantedAuthority> getAuthorities(String rolesString)
{\
// Asegurarse de que los roles tengan el prefijo "ROLE\_" si se usa
@PreAuthorize("hasRole('ADMIN')")\
// Si los roles en properties no tienen "ROLE\_", añadirlo aquí.\
return Arrays.stream(rolesString.split(","))\
.map(role -> "ROLE\_" + role.trim()) // Añadir prefijo ROLE\_\
.map(SimpleGrantedAuthority::new)\
.collect(Collectors.toList());\
}\
}

### **11.2. JwtUtil.java**

Ubicación: src/main/java/com/example/playlistapi/security/

package com.example.playlistapi.security;\
\
import io.jsonwebtoken.Claims;\
import io.jsonwebtoken.Jwts;\
import io.jsonwebtoken.SignatureAlgorithm;\
import io.jsonwebtoken.security.Keys;\
import org.springframework.beans.factory.annotation.Value;\
import org.springframework.security.core.GrantedAuthority;\
import org.springframework.security.core.userdetails.UserDetails;\
import org.springframework.stereotype.Component;\
\
import javax.crypto.SecretKey;\
import java.nio.charset.StandardCharsets;\
import java.util.Date;\
import java.util.HashMap;\
import java.util.Map;\
import java.util.function.Function;\
import java.util.stream.Collectors;\
\
@Component\
public class JwtUtil {\
\
@Value("\${jwt.secret}")\
private String secretString;\
\
@Value("\${jwt.expiration.ms}")\
private long jwtExpirationInMs;\
\
private SecretKey getSigningKey() {\
byte\[\] keyBytes =
this.secretString.getBytes(StandardCharsets.UTF\_8);\
return Keys.hmacShaKeyFor(keyBytes);\
}\
\
public String extractUsername(String token) {\
return extractClaim(token, Claims::getSubject);\
}\
\
public Date extractExpiration(String token) {\
return extractClaim(token, Claims::getExpiration);\
}\
\
public <T> T extractClaim(String token, Function<Claims, T>
claimsResolver) {\
final Claims claims = extractAllClaims(token);\
return claimsResolver.apply(claims);\
}\
\
private Boolean isTokenExpired(String token) {\
return extractExpiration(token).before(new Date());\
}\
\
public String generateToken(UserDetails userDetails) {\
Map<String, Object> claims = new HashMap<>();\
// Añadir roles como claim\
String roles = userDetails.getAuthorities().stream()\
.map(GrantedAuthority::getAuthority)\
.collect(Collectors.joining(","));\
claims.put("roles", roles);\
return createToken(claims, userDetails.getUsername());\
}\
\
private String createToken(Map<String, Object> claims, String
subject) {\
return Jwts.builder()\
.setClaims(claims)\
.setSubject(subject)\
.setIssuedAt(new Date(System.currentTimeMillis()))\
.setExpiration(new Date(System.currentTimeMillis() +
jwtExpirationInMs))\
.signWith(getSigningKey(), SignatureAlgorithm.HS512)\
.compact();\
}\
\
public Boolean validateToken(String token, UserDetails userDetails) {\
final String username = extractUsername(token);\
return (username.equals(userDetails.getUsername()) &&
!isTokenExpired(token));\
}\
}

### **11.3. JwtRequestFilter.java**

Ubicación: src/main/java/com/example/playlistapi/security/

package com.example.playlistapi.security;\
\
import io.jsonwebtoken.ExpiredJwtException;\
import io.jsonwebtoken.MalformedJwtException;\
import io.jsonwebtoken.UnsupportedJwtException;\
import io.jsonwebtoken.security.SignatureException;\
import jakarta.servlet.FilterChain;\
import jakarta.servlet.ServletException;\
import jakarta.servlet.http.HttpServletRequest;\
import jakarta.servlet.http.HttpServletResponse;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.beans.factory.annotation.Value;\
import
org.springframework.security.authentication.UsernamePasswordAuthenticationToken;\
import org.springframework.security.core.context.SecurityContextHolder;\
import org.springframework.security.core.userdetails.UserDetails;\
import
org.springframework.security.core.userdetails.UserDetailsService;\
import
org.springframework.security.web.authentication.WebAuthenticationDetailsSource;\
import org.springframework.stereotype.Component;\
import org.springframework.web.filter.OncePerRequestFilter;\
\
import java.io.IOException;\
\
@Component\
public class JwtRequestFilter extends OncePerRequestFilter {\
\
@Autowired\
private UserDetailsService userDetailsService; //
UserDetailsServiceImpl\
\
@Autowired\
private JwtUtil jwtUtil;\
\
@Value("\${jwt.header}")\
private String authorizationHeaderName;\
\
@Value("\${jwt.prefix}")\
private String jwtPrefix;\
\
@Override\
protected void doFilterInternal(HttpServletRequest request,
HttpServletResponse response, FilterChain chain)\
throws ServletException, IOException {\
\
final String authorizationHeader =
request.getHeader(authorizationHeaderName);\
\
String username = null;\
String jwt = null;\
\
if (authorizationHeader != null &&
authorizationHeader.startsWith(jwtPrefix + " ")) {\
jwt = authorizationHeader.substring(jwtPrefix.length() + 1);\
try {\
username = jwtUtil.extractUsername(jwt);\
} catch (IllegalArgumentException e) {\
logger.warn("No se pudo obtener el token JWT");\
} catch (ExpiredJwtException e) {\
logger.warn("El token JWT ha expirado");\
} catch (SignatureException | MalformedJwtException |
UnsupportedJwtException e) {\
logger.warn("Token JWT inválido: " + e.getMessage());\
}\
} else {\
// logger.warn("El encabezado de autorización no comienza con Bearer
String");\
}\
\
if (username != null &&
SecurityContextHolder.getContext().getAuthentication() == null) {\
UserDetails userDetails =
this.userDetailsService.loadUserByUsername(username);\
if (jwtUtil.validateToken(jwt, userDetails)) {\
UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
= new UsernamePasswordAuthenticationToken(\
userDetails, null, userDetails.getAuthorities());\
usernamePasswordAuthenticationToken\
.setDetails(new
WebAuthenticationDetailsSource().buildDetails(request));\
SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);\
}\
}\
chain.doFilter(request, response);\
}\
}

### **11.4. SecurityConfig.java**

Ubicación: src/main/java/com/example/playlistapi/config/

package com.example.playlistapi.config;\
\
import com.example.playlistapi.security.JwtAuthenticationEntryPoint;\
import com.example.playlistapi.security.JwtRequestFilter;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.context.annotation.Bean;\
import org.springframework.context.annotation.Configuration;\
import org.springframework.http.HttpMethod;\
import
org.springframework.security.authentication.AuthenticationManager;\
import
org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;\
import
org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;\
import
org.springframework.security.config.annotation.web.builders.HttpSecurity;\
import
org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;\
import org.springframework.security.config.http.SessionCreationPolicy;\
import
org.springframework.security.core.userdetails.UserDetailsService;\
import
org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\
import org.springframework.security.crypto.password.PasswordEncoder;\
import org.springframework.security.web.SecurityFilterChain;\
import
org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;\
\
@Configuration\
@EnableWebSecurity\
@EnableMethodSecurity(prePostEnabled = true) // Habilita @PreAuthorize\
public class SecurityConfig {\
\
@Autowired\
private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;\
\
@Autowired\
private UserDetailsService jwtUserDetailsService; //
UserDetailsServiceImpl\
\
@Autowired\
private JwtRequestFilter jwtRequestFilter;\
\
@Bean\
public PasswordEncoder passwordEncoder() {\
return new BCryptPasswordEncoder();\
}\
\
@Bean\
public AuthenticationManager
authenticationManager(AuthenticationConfiguration
authenticationConfiguration) throws Exception {\
return authenticationConfiguration.getAuthenticationManager();\
}\
\
@Bean\
public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws
Exception {\
httpSecurity\
.csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para APIs
stateless\
.authorizeHttpRequests(auth -> auth\
.requestMatchers("/api/auth/login").permitAll() // Endpoint de login
público\
.requestMatchers("/h2-console/\*\*").permitAll() // Permitir acceso a H2
console\
// Configuración de acceso a los endpoints de la API\
// Los GETs son para USER y ADMIN\
.requestMatchers(HttpMethod.GET, "/api/songs/\*\*",
"/api/lists/\*\*").hasAnyRole("USER", "ADMIN")\
// POST, PUT, DELETE son solo para ADMIN\
.requestMatchers(HttpMethod.POST, "/api/songs/\*\*",
"/api/lists/\*\*").hasRole("ADMIN")\
.requestMatchers(HttpMethod.PUT, "/api/songs/\*\*",
"/api/lists/\*\*").hasRole("ADMIN")\
.requestMatchers(HttpMethod.DELETE, "/api/songs/\*\*",
"/api/lists/\*\*").hasRole("ADMIN")\
.anyRequest().authenticated() // Todas las demás peticiones requieren
autenticación\
)\
.exceptionHandling(ex ->
ex.authenticationEntryPoint(jwtAuthenticationEntryPoint)) // Manejador
para inicios de autenticación fallidos\
.sessionManagement(session ->
session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Sin
estado\
\
// Añadir filtro JWT\
httpSecurity.addFilterBefore(jwtRequestFilter,
UsernamePasswordAuthenticationFilter.class);\
\
// Para H2 console (necesario si se usa Spring Security con H2 console)\
httpSecurity.headers(headers -> headers.frameOptions(frameOptions
-> frameOptions.sameOrigin()));\
\
\
return httpSecurity.build();\
}\
}

### **11.5. JwtAuthenticationEntryPoint.java (Para manejar errores de autenticación)**

Ubicación: src/main/java/com/example/playlistapi/security/

package com.example.playlistapi.security;\
\
import com.example.playlistapi.dto.ErrorResponseDto;\
import com.fasterxml.jackson.databind.ObjectMapper;\
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;\
import jakarta.servlet.http.HttpServletRequest;\
import jakarta.servlet.http.HttpServletResponse;\
import org.springframework.http.HttpStatus;\
import org.springframework.http.MediaType;\
import org.springframework.security.core.AuthenticationException;\
import org.springframework.security.web.AuthenticationEntryPoint;\
import org.springframework.stereotype.Component;\
\
import java.io.IOException;\
import java.io.OutputStream;\
import java.time.LocalDateTime;\
\
@Component\
public class JwtAuthenticationEntryPoint implements
AuthenticationEntryPoint {\
\
@Override\
public void commence(HttpServletRequest request, HttpServletResponse
response,\
AuthenticationException authException) throws IOException {\
\
response.setStatus(HttpStatus.UNAUTHORIZED.value());\
response.setContentType(MediaType.APPLICATION\_JSON\_VALUE);\
\
ErrorResponseDto errorResponse = new ErrorResponseDto(\
LocalDateTime.now(),\
HttpStatus.UNAUTHORIZED.value(),\
"Unauthorized",\
"Se requiere autenticación para acceder a este recurso. " +
authException.getMessage(),\
request.getRequestURI(),\
null\
);\
\
OutputStream out = response.getOutputStream();\
ObjectMapper mapper = new ObjectMapper();\
mapper.registerModule(new JavaTimeModule()); // Para serializar
LocalDateTime\
mapper.writeValue(out, errorResponse);\
out.flush();\
}\
}

### **11.6. AuthController.java (Para el endpoint de login)**

Ubicación: src/main/java/com/example/playlistapi/controller/

package com.example.playlistapi.controller;\
\
import com.example.playlistapi.dto.AuthRequestDto;\
import com.example.playlistapi.dto.AuthResponseDto;\
import com.example.playlistapi.security.JwtUtil;\
import jakarta.validation.Valid;\
import org.springframework.beans.factory.annotation.Autowired;\
import org.springframework.http.ResponseEntity;\
import
org.springframework.security.authentication.AuthenticationManager;\
import
org.springframework.security.authentication.BadCredentialsException;\
import org.springframework.security.authentication.DisabledException;\
import
org.springframework.security.authentication.UsernamePasswordAuthenticationToken;\
import org.springframework.security.core.userdetails.UserDetails;\
import
org.springframework.security.core.userdetails.UserDetailsService;\
import org.springframework.web.bind.annotation.PostMapping;\
import org.springframework.web.bind.annotation.RequestBody;\
import org.springframework.web.bind.annotation.RequestMapping;\
import org.springframework.web.bind.annotation.RestController;\
\
@RestController\
@RequestMapping("/api/auth")\
public class AuthController {\
\
@Autowired\
private AuthenticationManager authenticationManager;\
\
@Autowired\
private JwtUtil jwtUtil;\
\
@Autowired\
private UserDetailsService userDetailsService; //
UserDetailsServiceImpl\
\
@PostMapping("/login")\
public ResponseEntity<?> createAuthenticationToken(@Valid
@RequestBody AuthRequestDto authenticationRequest) throws Exception {\
authenticate(authenticationRequest.getUsername(),
authenticationRequest.getPassword());\
final UserDetails userDetails =
userDetailsService.loadUserByUsername(authenticationRequest.getUsername());\
final String token = jwtUtil.generateToken(userDetails);\
return ResponseEntity.ok(new AuthResponseDto(token));\
}\
\
private void authenticate(String username, String password) throws
Exception {\
try {\
authenticationManager.authenticate(new
UsernamePasswordAuthenticationToken(username, password));\
} catch (DisabledException e) {\
throw new Exception("USER\_DISABLED", e);\
} catch (BadCredentialsException e) {\
// Esta excepción ya se maneja en GlobalExceptionHandler para dar un
401\
// throw new Exception("INVALID\_CREDENTIALS", e);\
throw new BadCredentialsException("Credenciales inválidas");\
}\
}\
}

**12. Implementación de Pruebas Unitarias**
-------------------------------------------

Ubicación: src/test/java/com/example/playlistapi/ (replicar estructura
de paquetes service y controller).

### **Ejemplo: PlaylistServiceTest.java**

package com.example.playlistapi.service;\
\
import com.example.playlistapi.dto.PlaylistRequestDto;\
import com.example.playlistapi.dto.PlaylistResponseDto;\
import com.example.playlistapi.entity.Playlist;\
import com.example.playlistapi.entity.Song;\
import com.example.playlistapi.exception.BadRequestException;\
import com.example.playlistapi.exception.ResourceNotFoundException;\
import com.example.playlistapi.repository.PlaylistRepository;\
import com.example.playlistapi.repository.SongRepository;\
import org.junit.jupiter.api.Test;\
import org.junit.jupiter.api.extension.ExtendWith;\
import org.mockito.InjectMocks;\
import org.mockito.Mock;\
import org.mockito.junit.jupiter.MockitoExtension;\
\
import java.util.Optional;\
import java.util.Collections;\
import java.util.HashSet;\
import java.util.List;\
\
import static org.junit.jupiter.api.Assertions.\*;\
import static org.mockito.ArgumentMatchers.any;\
import static org.mockito.Mockito.\*;\
\
@ExtendWith(MockitoExtension.class)\
class PlaylistServiceTest {\
\
@Mock\
private PlaylistRepository playlistRepository;\
\
@Mock\
private SongRepository songRepository;\
\
@InjectMocks\
private PlaylistService playlistService;\
\
@Test\
void createPlaylist\_success() {\
PlaylistRequestDto requestDto = new PlaylistRequestDto("Mi Lista",
"Descripción", Collections.emptySet());\
Playlist playlist = new Playlist(1L, "Mi Lista", "Descripción", new
HashSet<>());\
\
when(playlistRepository.existsByNombre("Mi Lista")).thenReturn(false);\
when(playlistRepository.save(any(Playlist.class))).thenReturn(playlist);\
\
PlaylistResponseDto responseDto =
playlistService.createPlaylist(requestDto);\
\
assertNotNull(responseDto);\
assertEquals("Mi Lista", responseDto.getNombre());\
verify(playlistRepository, times(1)).save(any(Playlist.class));\
}\
\
@Test\
void createPlaylist\_nameAlreadyExists\_throwsBadRequestException() {\
PlaylistRequestDto requestDto = new PlaylistRequestDto("Existente",
"Desc", Collections.emptySet());\
when(playlistRepository.existsByNombre("Existente")).thenReturn(true);\
\
assertThrows(BadRequestException.class, () ->
playlistService.createPlaylist(requestDto));\
verify(playlistRepository, never()).save(any(Playlist.class));\
}\
\
@Test\
void getPlaylistByNombre\_found() {\
Playlist playlist = new Playlist(1L, "Buscada", "Desc", new
HashSet<>());\
when(playlistRepository.findByNombre("Buscada")).thenReturn(Optional.of(playlist));\
\
PlaylistResponseDto responseDto =
playlistService.getPlaylistByNombre("Buscada");\
\
assertNotNull(responseDto);\
assertEquals("Buscada", responseDto.getNombre());\
}\
\
@Test\
void getPlaylistByNombre\_notFound\_throwsResourceNotFoundException() {\
when(playlistRepository.findByNombre("NoExiste")).thenReturn(Optional.empty());\
assertThrows(ResourceNotFoundException.class, () ->
playlistService.getPlaylistByNombre("NoExiste"));\
}\
\
// Añadir más pruebas para los demás métodos:\
// - createPlaylistWithSong\
// - getAllPlaylists\
// - getPlaylistById\
// - updatePlaylist (éxito, no encontrado, nombre duplicado en otra
lista)\
// - deletePlaylistByNombre (éxito, no encontrado)\
// - deletePlaylistById (éxito, no encontrado)\
// - Casos con canciones (IDs de canciones válidos, inválidos)\
}

**Nota:** Implementar pruebas similares para SongService,
PlaylistController, SongController y AuthController. Para los
controladores, usar @WebMvcTest y MockMvc.

**13. Consideraciones Finales y Ejecución**
-------------------------------------------

-   **Compilar y Ejecutar:**

    -   Desde la raíz del proyecto, usando Maven:\
        > mvn clean install\
        > mvn spring-boot:run

    -   La API estará disponible en http://localhost:8080.

-   **Consola H2:**

    -   Accede a http://localhost:8080/h2-console.

    -   **JDBC URL:** jdbc:h2:mem:playlistdb

    -   **User Name:** sa

    -   **Password:** password (o la que hayas configurado)

-   **Flujo de Autenticación:**

    1.  Realiza un POST a /api/auth/login con username y password en el
        > body.

    2.  Recibirás un token JWT en la respuesta.

    3.  Para acceder a endpoints protegidos, incluye este token en el
        > header Authorization de tus peticiones: Authorization: Bearer
        > <tu\_token\_jwt>.

-   **Roles:**

    -   **ADMIN** (usuario: admin, pass: adminpass): Acceso completo a
        > todos los endpoints de /api/songs/\*\* y /api/lists/\*\*.

    -   **USER** (usuario: user, pass: userpass): Solo acceso GET a
        > /api/songs/\*\* y /api/lists/\*\*.

Este plan detallado debería proporcionar una base sólida para la
construcción del proyecto.
