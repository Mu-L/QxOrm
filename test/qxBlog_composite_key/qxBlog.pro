include(../../QxOrm.pri)

TEMPLATE = app
DEFINES += _BUILDING_QX_BLOG
INCLUDEPATH += ../../../QxOrm/include/
DESTDIR = ../../../QxOrm/test/_bin/
LIBS += -L"../../../QxOrm/test/_bin"
PRECOMPILED_HEADER = ./include/precompiled.h

CONFIG(debug, debug|release) {
TARGET = qxBlogd_composite_key
LIBS += -l"QxOrmd"
} else {
TARGET = qxBlog_composite_key
LIBS += -l"QxOrm"
} # CONFIG(debug, debug|release)

HEADERS += ./include/precompiled.h
HEADERS += ./include/export.h
HEADERS += ./include/author.h
HEADERS += ./include/blog.h
HEADERS += ./include/category.h
HEADERS += ./include/comment.h

SOURCES += ./src/author.cpp
SOURCES += ./src/blog.cpp
SOURCES += ./src/category.cpp
SOURCES += ./src/comment.cpp
SOURCES += ./src/main.cpp