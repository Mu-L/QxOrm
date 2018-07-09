/****************************************************************************
**
** Copyright (C) 2010 QxOrm France and/or its subsidiary(-ies)
** Contact: QxOrm France Information (contact@qxorm.com)
**
** This file is part of the QxOrm library
**
** Commercial Usage
** Licensees holding valid QxOrm Commercial licenses may use this file in
** accordance with the QxOrm Commercial License Agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and QxOrm France
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 3.0 as published by the Free Software
** Foundation and appearing in the file 'license.gpl3.txt' included in the
** packaging of this file. Please review the following information to
** ensure the GNU General Public License version 3.0 requirements will be
** met: http://www.gnu.org/copyleft/gpl.html
**
** If you are unsure which license is appropriate for your use, please
** contact the support department at support@qxorm.com
**
****************************************************************************/

#if (QT_VERSION >= 0x040600)
#ifndef _QX_IS_QT_SCOPED_PTR_H_
#define _QX_IS_QT_SCOPED_PTR_H_

#ifdef _MSC_VER
#pragma once
#endif

#include <QtCore/qscopedpointer.h>

#include <boost/mpl/if.hpp>
#include <boost/mpl/logical.hpp>

namespace qx {
namespace trait {

template <typename T>
class is_qt_scoped_ptr
{

private:

   template <typename V> static char isSmartPtr(QScopedPointer<V>);
   static int isSmartPtr(...);
   static T t;

public:

   enum { value = (sizeof(qx::trait::is_qt_scoped_ptr<T>::isSmartPtr(t)) == sizeof(char)) };

   typedef typename boost::mpl::if_c<qx::trait::is_qt_scoped_ptr<T>::value, 
                                     boost::mpl::true_, 
                                     boost::mpl::false_>::type type;

};

} // namespace trait
} // namespace qx

#endif // _QX_IS_QT_SCOPED_PTR_H_
#endif // (QT_VERSION >= 0x040600)

#if (QT_VERSION < 0x040600)
#ifndef _QX_IS_QT_SCOPED_PTR_H_
#define _QX_IS_QT_SCOPED_PTR_H_
namespace qx { namespace trait {
template <typename T>
class is_qt_scoped_ptr
{ public: enum { value = false }; typedef boost::mpl::false_ type; };
} } // namespace qx::trait
#endif // _QX_IS_QT_SCOPED_PTR_H_
#endif // (QT_VERSION < 0x040600)