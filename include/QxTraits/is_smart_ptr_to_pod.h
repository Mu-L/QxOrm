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

#ifndef _QX_IS_SMART_PTR_TO_POD_H_
#define _QX_IS_SMART_PTR_TO_POD_H_

#ifdef _MSC_VER
#pragma once
#endif

#include <boost/mpl/if.hpp>
#include <boost/mpl/logical.hpp>

#include "../../include/QxTraits/is_smart_ptr.h"
#include "../../include/QxTraits/is_qx_pod.h"

namespace qx {
namespace trait {

template <typename T>
class is_smart_ptr_to_pod
{

private:

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const boost::scoped_ptr<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const boost::shared_ptr<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const boost::weak_ptr<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const boost::intrusive_ptr<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const QSharedDataPointer<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const QSharedPointer<U> &);

   template <typename U>
   static typename boost::mpl::if_c<qx::trait::is_qx_pod<U>::value, char, int>::type removeSmartPtr(const QWeakPointer<U> &);

   static int removeSmartPtr(...);
   static T t;

public:

   enum { value = (qx::trait::is_smart_ptr<T>::value && (sizeof(qx::trait::is_smart_ptr_to_pod<T>::removeSmartPtr(t)) == sizeof(char))) };

   typedef typename boost::mpl::if_c<qx::trait::is_smart_ptr_to_pod<T>::value, boost::mpl::true_, boost::mpl::false_>::type type;

};

} // namespace trait
} // namespace qx

#endif // _QX_IS_SMART_PTR_TO_POD_H_