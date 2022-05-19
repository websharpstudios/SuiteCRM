<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\FieldDefinitions\Service;

/**
 * Class LegacyToFrontendDefinitionMapper
 */
class LegacyToFrontendDefinitionMapper
{

    /**
     * LegacyToFrontendDefinitionMapper constructor
     */
    public function __construct()
    {
    }

    /**
     * @param array $vardefs
     * @param array $legacyMap
     * @param array $frontendMap
     * @return array return transformed vardefs
     */
    public function getTransformedVardefs(array $vardefs, array $legacyMap, array $frontendMap): array
    {
        if (empty($vardefs)) {
            return [];
        }

        foreach ($vardefs as $name => $vardef) {
            $vardefs[$name] = $this->transformVardef($vardef, $legacyMap, $frontendMap);
        }

        return $vardefs;
    }

    /**
     * @param array $vardef
     * @param array $legacyMap
     * @param array $frontendMap
     * @return array return transformed vardef
     */
    public function transformVardef(array $vardef, array $legacyMap, array $frontendMap): array
    {
        $matches = array_uintersect_uassoc($vardef, $legacyMap, "strcasecmp", "strcasecmp");

        if (empty($matches)) {
            return $vardef;
        }

        foreach (array_keys($matches) as $matchKey) {
            unset($vardef[$matchKey]);
        }

        return array_merge($vardef, $frontendMap);
    }
}
