if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/salah/.gradle/caches/8.10.2/transforms/90773311d8af38d2592dba0ae56fb603/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/salah/.gradle/caches/8.10.2/transforms/90773311d8af38d2592dba0ae56fb603/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

