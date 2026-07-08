<?php

namespace App\Services;

class DemoDataService
{
    private const ACHIEVABLE_RATIO = 0.75;

    private const OFFICES = [
        'Downtown Office',
        'Marina Branch',
        'Lakeside Office',
        'Riverside Branch',
        'Central Plaza Office',
        'Westview Branch',
    ];

    private const PROPERTY_TYPES = [
        'Residential',
        'Commercial',
        'Luxury',
        'Industrial',
        'Land',
        'Mixed-Use',
    ];

    private const AGENCIES = [
        'alpha',
        'beta',
        'gamma',
        'delta',
        'epsilon',
    ];

    /**
     * Each agent is assigned to 1–3 agencies only.
     *
     * @var array<string, list<string>>
     */
    private const AGENT_OFFICES = [
        'Sarah Chen' => ['alpha'],
        'James Wilson' => ['beta'],
        'Maria Lopez' => ['gamma'],
        'Emily Park' => ['delta'],
        'Ahmed Hassan' => ['epsilon'],
        'Robert Kim' => ['alpha', 'beta'],
        'Fatima Al-Rashid' => ['beta', 'gamma'],
        'David Okonkwo' => ['gamma', 'delta'],
        'Priya Sharma' => ['delta', 'epsilon'],
        'Michael Torres' => ['alpha', 'beta', 'gamma'],
        'Yuki Tanaka' => ['beta', 'gamma', 'delta'],
        'Olivia Bennett' => ['gamma', 'delta', 'epsilon'],
        'Hassan El-Masry' => ['alpha', 'delta', 'epsilon'],
    ];

    private const PM_SERVICE_LOCATIONS = [
        'Building A',
        'Building B',
        'Maintenance Hub',
        'Tenant Portal',
        'Marina Tower',
        'Downtown Complex',
        'Lakeside Residences',
        'Riverside Plaza',
        'Central Business Park',
        'Westview Estates',
        'Airport District',
        'Harbor View',
        'Garden District',
        'Tech Park',
        'University Quarter',
        'Community Center',
    ];

    private const SUB_OFFICE_NAMES = ['Section 1', 'Section 2', 'Section 3'];

    /**
     * Each agency has its own sales teams and member roster.
     *
     * @var array<string, list<array{name: string, members: list<string>}>>
     */
    private const AGENCY_SALES_TEAMS = [
        'alpha' => [
            ['name' => 'Team A', 'members' => ['Alex Morgan', 'Jordan Lee', 'Casey Kim']],
            ['name' => 'Team B', 'members' => ['Riley Chen', 'Taylor Brooks']],
            ['name' => 'Team C', 'members' => ['Morgan Patel', 'Jamie Fox', 'Avery Stone']],
            ['name' => 'Team D', 'members' => ['Quinn Reed', 'Sam Rivera', 'Drew Ellis']],
        ],
        'beta' => [
            ['name' => 'Team A', 'members' => ['Noor Hassan', 'Omar Khalil', 'Layla Rahman']],
            ['name' => 'Team B', 'members' => ['Fatima Al-Mansoori', 'James Mitchell']],
            ['name' => 'Team C', 'members' => ['David Chen', 'Sarah Thompson', 'Raj Patel']],
        ],
        'gamma' => [
            ['name' => 'Team A', 'members' => ['Sofia Martinez', 'Emily Nakamura']],
            ['name' => 'Team B', 'members' => ['Michael O\'Brien', 'Aisha Ibrahim', 'Omar Khalil']],
            ['name' => 'Team C', 'members' => ['Priya Sharma', 'Hassan El-Masry', 'Yuki Tanaka']],
            ['name' => 'Team D', 'members' => ['Olivia Bennett', 'Robert Kim']],
        ],
        'delta' => [
            ['name' => 'Team A', 'members' => ['Jamie Fox', 'Taylor Brooks', 'Casey Kim']],
            ['name' => 'Team B', 'members' => ['Morgan Patel', 'Alex Morgan']],
            ['name' => 'Team C', 'members' => ['Jordan Lee', 'Riley Chen', 'Avery Stone', 'Quinn Reed']],
        ],
        'epsilon' => [
            ['name' => 'Team A', 'members' => ['Drew Ellis', 'Sam Rivera']],
            ['name' => 'Team B', 'members' => ['Fatima Al-Rashid', 'David Okonkwo', 'Emily Park']],
            ['name' => 'Team C', 'members' => ['Maria Lopez', 'Ahmed Hassan']],
            ['name' => 'Team D', 'members' => ['James Wilson', 'Sarah Chen', 'Michael Torres']],
        ],
    ];

    private const CLIENT_FIRST_NAMES = [
        'Fatima',
        'James',
        'Layla',
        'Michael',
        'Aisha',
        'David',
        'Noor',
        'Sarah',
        'Omar',
        'Emily',
        'Raj',
        'Sofia',
    ];

    private const CLIENT_LAST_NAMES = [
        'Al-Mansoori',
        'Mitchell',
        'Hassan',
        'O\'Brien',
        'Rahman',
        'Chen',
        'Ibrahim',
        'Thompson',
        'Khalil',
        'Nakamura',
        'Patel',
        'Martinez',
    ];

    private const DEALS_PER_AGENCY = 12;

    private const PHONE_PREFIXES = ['050', '052', '054', '055', '056', '058'];

    /**
     * @return array<int|string, mixed>
     */
    public function retrieve(string $businessName, string $endpointName): array
    {
        $multiplier = $this->multiplierFor($businessName);
        $profile = $this->businessProfile($businessName);

        return match ($endpointName) {
            'stats' => $this->stats($businessName, $multiplier, $profile),
            'target' => $this->target($profile),
            'property-types' => $this->propertyTypes($businessName, $multiplier, $profile),
            'agents' => $this->agents($businessName, $multiplier, $profile),
            'deals' => $this->deals($businessName, $multiplier, $profile),
            'property-services' => $this->propertyServices($businessName, $multiplier, $profile),
            'sub-offices' => $this->subOffices($businessName, $multiplier, $profile),
            'sales-teams' => $this->salesTeams($businessName, $multiplier, $profile),
            default => [],
        };
    }

    private function multiplierFor(string $businessName): float
    {
        return 0.8 + (crc32($businessName) % 40) / 100;
    }

    /**
     * Annual-style targets ranked by agency size (alpha largest → epsilon smallest).
     * Zeta is a special low-volume profile kept well below the main agencies.
     *
     * @var array<string, int>
     */
    private const BUSINESS_TARGETS = [
        'alpha' => 200_000_000,
        'beta' => 160_000_000,
        'gamma' => 120_000_000,
        'delta' => 90_000_000,
        'epsilon' => 65_000_000,
        'zeta' => 12_000_000,
    ];

    /**
     * @return array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}
     */
    private function businessProfile(string $businessName): array
    {
        $seed = crc32($businessName);
        // Ranked targets keep Greek-letter agency size intentional instead of hash-random.
        $target = self::BUSINESS_TARGETS[$businessName]
            ?? $this->roundMoney(80_000_000 + ($seed % 120_000_001));
        $progressPercent = 5 + ($seed % 36);
        $achievedMtd = $this->roundMoney($target * ($progressPercent / 100));
        $achievableMonth = $this->roundMoney($target * self::ACHIEVABLE_RATIO);
        $dailyIncome = max(500, $this->roundMoney($achievableMonth / 30));

        return [
            'target' => $target,
            'progress_percent' => $progressPercent,
            'achieved_mtd' => $achievedMtd,
            'achievable_month' => $achievableMonth,
            'daily_income' => $dailyIncome,
        ];
    }

    /**
     * Round money to clean display amounts (8500, not 8630).
     */
    private function roundMoney(float|int $value): int
    {
        $value = max(0, (float) $value);

        if ($value === 0.0) {
            return 0;
        }

        $step = match (true) {
            $value < 10_000 => 500,
            $value < 100_000 => 1_000,
            $value < 1_000_000 => 5_000,
            $value < 10_000_000 => 50_000,
            $value < 100_000_000 => 100_000,
            default => 500_000,
        };

        return (int) (round($value / $step) * $step);
    }

    private function scaled(int $base, float $multiplier, float $factor = 1.0): int
    {
        return (int) round($base * $multiplier * $factor);
    }

    private function scaledMoney(int $base, float $multiplier, float $factor = 1.0): int
    {
        return $this->roundMoney($base * $multiplier * $factor);
    }

    private function dayOfMonthScale(): float
    {
        return max(1, (int) now()->format('j')) * 0.92;
    }

    private function recordRatio(string $seed): float
    {
        return 0.72 + (crc32($seed.':highest_month') % 35) / 100;
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     */
    private function seedDailyIncome(array $profile, float $share = 1.0): int
    {
        return max(500, $this->roundMoney($profile['daily_income'] * $share));
    }

    /**
     * @return array{current: int, highest: int, ratio: float}
     */
    private function monthToDateIncome(string $seed, float $multiplier, int $dailyBase, float $factor = 1.0): array
    {
        $current = $this->scaledMoney((int) round($dailyBase * $this->dayOfMonthScale()), $multiplier, $factor);
        $ratio = $this->recordRatio($seed);
        $highest = $this->roundMoney($current * $ratio);

        return [
            'current' => $current,
            'highest' => $highest,
            'ratio' => $ratio,
        ];
    }

    private function monthToDateCount(float $multiplier, int $periodBase, float $factor, float $ratio = 1.0): int
    {
        $dayScale = $this->dayOfMonthScale() / 28;

        return $this->scaled($periodBase, $multiplier, $factor * $dayScale * $ratio);
    }

    private function salesTeamActivityFactor(string $seed): float
    {
        return 0.45 + (crc32("{$seed}:activity") % 111) / 100;
    }

    private function salesTeamIncomeFactor(string $seed): float
    {
        return 0.35 + (crc32("{$seed}:income") % 141) / 100;
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function stats(string $seed, float $multiplier, array $profile): array
    {
        $share = 1.0;
        if (str_contains($seed, ':')) {
            $share = 0.28 + (crc32($seed) % 15) / 100;
        }

        $dailyBase = $this->seedDailyIncome($profile, $share);
        $monthPair = $this->monthToDateIncome($seed, $multiplier, $dailyBase);

        if (! str_contains($seed, ':')) {
            $monthPair['current'] = $this->scaledMoney($profile['achieved_mtd'], $multiplier, $share);
            $monthPair['highest'] = $this->roundMoney($monthPair['current'] * $monthPair['ratio']);
        }

        $dayScale = $this->dayOfMonthScale() / 28;

        $periods = [
            'today' => ['income' => $this->scaledMoney($dailyBase, $multiplier), 'count_scale' => 1.0],
            'yesterday' => ['income' => $this->scaledMoney($dailyBase, $multiplier, 0.82), 'count_scale' => 0.82],
            'month' => ['income' => $monthPair['current'], 'count_scale' => $dayScale],
            'highest_month' => ['income' => $monthPair['highest'], 'count_scale' => $dayScale * $monthPair['ratio']],
        ];

        return array_map(function (string $period, array $config) use ($multiplier) {
            $income = $config['income'];
            $countScale = $config['count_scale'];
            $reservations = $this->scaled(105, $multiplier, $countScale);
            $new = $this->scaled(36, $multiplier, $countScale);
            $followup = max(0, $reservations - $new);
            $arrived = $this->scaled(82, $multiplier, $countScale);
            $newArrived = $this->scaled(30, $multiplier, $countScale);
            $followupArrived = max(0, $arrived - $newArrived);
            $percentage = $reservations > 0 ? (int) round(($arrived / $reservations) * 100) : 0;

            return [
                'period' => $period,
                'income' => $income,
                'reservations' => $reservations,
                'new' => $new,
                'followup' => $followup,
                'arrived' => $arrived,
                'new_arrived' => $newArrived,
                'followup_arrived' => $followupArrived,
                'percentage' => $percentage,
            ];
        }, array_keys($periods), array_values($periods));
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return array{done_m: int, waiting_m: int}
     */
    private function target(array $profile): array
    {
        $achieved = $profile['achieved_mtd'];
        $remaining = $profile['target'] - $achieved;

        return [
            'done_m' => $profile['target'],
            'waiting_m' => $this->roundMoney($remaining),
        ];
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function propertyTypes(string $businessName, float $multiplier, array $profile): array
    {
        $propertyTypeDailyIncome = max(500, $this->roundMoney($profile['daily_income'] / count(self::PROPERTY_TYPES)));

        return array_map(function (string $name, int $index) use ($businessName, $multiplier, $propertyTypeDailyIncome) {
            $factor = 1 + ($index * 0.12);
            $monthPair = $this->monthToDateIncome("{$businessName}:property-type:{$name}", $multiplier, $propertyTypeDailyIncome, $factor);

            return [
                'property_type' => $name,
                'new' => $this->monthToDateCount($multiplier, 14, $factor),
                'current' => $monthPair['current'],
                'highest' => $monthPair['highest'],
            ];
        }, self::PROPERTY_TYPES, array_keys(self::PROPERTY_TYPES));
    }

    /**
     * @return list<string>
     */
    private function allAgents(): array
    {
        return array_keys(self::AGENT_OFFICES);
    }

    /**
     * @return list<string>
     */
    private function agentsForOffice(string $agency): array
    {
        if (! in_array($agency, self::AGENCIES, true)) {
            return [];
        }

        $agents = [];

        foreach (self::AGENT_OFFICES as $agent => $agencies) {
            if (in_array($agency, $agencies, true)) {
                $agents[] = $agent;
            }
        }

        return $agents;
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function agents(string $businessName, float $multiplier, array $profile): array
    {
        $officeAgents = $this->agentsForOffice($businessName);

        if ($officeAgents === []) {
            return [];
        }

        $agentDailyIncome = max(500, $this->roundMoney($profile['daily_income'] / max(1, count($officeAgents) * 0.9)));

        return array_map(function (string $agent) use ($businessName, $multiplier, $agentDailyIncome) {
            $index = array_search($agent, $this->allAgents(), true);
            $factor = 1 + ($index * 0.1);
            $propertyTypeCount = ($index % 3) + 1;
            $propertyTypes = array_slice(self::PROPERTY_TYPES, $index % 4, $propertyTypeCount);
            $monthPair = $this->monthToDateIncome("{$businessName}:agent:{$agent}", $multiplier, $agentDailyIncome, $factor);
            $currentNewLeads = $this->monthToDateCount($multiplier, 9, $factor);
            $currentFollowUp = $this->monthToDateCount($multiplier, 16, $factor);

            return [
                'agent' => $agent,
                'property_types' => $propertyTypes,
                'current' => [
                    'income' => $monthPair['current'],
                    'new_leads' => $currentNewLeads,
                    'follow_up' => $currentFollowUp,
                ],
                'highest' => [
                    'income' => $monthPair['highest'],
                    'new_leads' => (int) round($currentNewLeads * $monthPair['ratio']),
                    'follow_up' => (int) round($currentFollowUp * $monthPair['ratio']),
                ],
            ];
        }, $officeAgents);
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function deals(string $businessName, float $multiplier, array $profile): array
    {
        $deals = [];
        // Closing prices in the mid-hundreds of thousands to low millions.
        $dealBase = max(450_000, $this->roundMoney($profile['achievable_month'] / 80));

        for ($i = 0; $i < self::DEALS_PER_AGENCY; $i++) {
            $office = self::OFFICES[($i + crc32($businessName)) % count(self::OFFICES)];
            $propertyType = self::PROPERTY_TYPES[$i % count(self::PROPERTY_TYPES)];
            $price = $this->scaledMoney($dealBase, $multiplier, 1 + ($i * 0.08));
            $paid = $this->scaledMoney((int) round($dealBase * 0.65), $multiplier, 1 + ($i * 0.06));
            $sqftRaw = 800 + (($i + crc32($businessName)) % 3200) + ($i * 50);

            $deals[] = [
                'client' => $this->clientNameForDeal($businessName, $i),
                'phone' => $this->dealPhone($businessName, $i),
                'listing_id' => strtoupper(substr($businessName, 0, 2)).'-'.(1000 + $i),
                'sqft' => (int) (round($sqftRaw / 50) * 50),
                'office' => $office,
                'property_type' => $propertyType,
                'date' => now()->subDays($i)->format('Y-m-d'),
                'inspection_time' => sprintf('%02d:%02d', 8 + ($i % 8), ($i * 15) % 60),
                'from' => sprintf('%02d:%02d', 9 + ($i % 6), 0),
                'to' => sprintf('%02d:%02d', 11 + ($i % 6), 30),
                'paid' => $paid,
                'price' => $price,
                'due' => max(0, $price - $paid),
                'agents' => [$this->allAgents()[$i % count($this->allAgents())]],
                'services' => [$propertyType.' Closing'],
            ];
        }

        return $deals;
    }

    private function dealClientIndex(string $businessName, int $index): int
    {
        $agencyIndex = array_search($businessName, self::AGENCIES, true);

        if ($agencyIndex === false) {
            $agencyIndex = abs(crc32($businessName)) % max(1, count(self::AGENCIES));
        }

        return ($agencyIndex * self::DEALS_PER_AGENCY) + $index;
    }

    private function clientNameForDeal(string $businessName, int $index): string
    {
        $globalIndex = $this->dealClientIndex($businessName, $index);
        $first = self::CLIENT_FIRST_NAMES[$globalIndex % count(self::CLIENT_FIRST_NAMES)];
        $last = self::CLIENT_LAST_NAMES[intdiv($globalIndex, count(self::CLIENT_FIRST_NAMES)) % count(self::CLIENT_LAST_NAMES)];

        return "{$first} {$last}";
    }

    private function dealPhone(string $businessName, int $index): string
    {
        $seed = crc32("{$businessName}:deal:phone:{$index}");
        $prefix = self::PHONE_PREFIXES[$seed % count(self::PHONE_PREFIXES)];

        return $prefix.'xxxxxxx';
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function propertyServices(string $businessName, float $multiplier, array $profile): array
    {
        $locationDailyIncome = max(500, $this->roundMoney($profile['daily_income'] / count(self::PM_SERVICE_LOCATIONS)));

        return array_map(function (string $location, int $index) use ($businessName, $multiplier, $locationDailyIncome) {
            $factor = 1 + ($index * 0.08);
            $monthPair = $this->monthToDateIncome("{$businessName}:property-services:{$location}", $multiplier, $locationDailyIncome, $factor);

            return [
                'location' => $location,
                'today' => $this->scaledMoney($locationDailyIncome, $multiplier, $factor),
                'yesterday' => $this->scaledMoney($locationDailyIncome, $multiplier, $factor * 0.85),
                'current_month' => $monthPair['current'],
                'highest_month' => $monthPair['highest'],
            ];
        }, self::PM_SERVICE_LOCATIONS, array_keys(self::PM_SERVICE_LOCATIONS));
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function subOffices(string $businessName, float $multiplier, array $profile): array
    {
        return array_map(function (string $name, int $index) use ($businessName, $multiplier, $profile) {
            $sectionMultiplier = $multiplier * (1 + ($index * 0.08));

            return [
                'name' => $name,
                'stats' => $this->stats("{$businessName}:{$name}", $sectionMultiplier, $profile),
            ];
        }, self::SUB_OFFICE_NAMES, array_keys(self::SUB_OFFICE_NAMES));
    }

    /**
     * @param  array{target: int, progress_percent: int, achieved_mtd: int, achievable_month: int, daily_income: int}  $profile
     * @return list<array<string, mixed>>
     */
    private function salesTeams(string $businessName, float $multiplier, array $profile): array
    {
        $teams = self::AGENCY_SALES_TEAMS[$businessName] ?? [];

        if ($teams === []) {
            return [];
        }

        $teamMtdIncome = max(5_000, $this->roundMoney($profile['achieved_mtd'] / max(1, count($teams))));

        return array_map(function (array $team) use ($businessName, $multiplier, $teamMtdIncome) {
            $teamSeed = "{$businessName}:sales-team:{$team['name']}";
            $activityFactor = $this->salesTeamActivityFactor($teamSeed);
            $incomeFactor = $this->salesTeamIncomeFactor($teamSeed);

            $reservations = $this->scaled(210, $multiplier, $activityFactor);
            $doneReservations = $this->scaled(165, $multiplier, $activityFactor);
            $calls = $this->scaled(480, $multiplier, $activityFactor);
            $answeredCalls = $this->scaled(390, $multiplier, $activityFactor);
            $income = $this->scaledMoney($teamMtdIncome, $multiplier, $incomeFactor);

            $members = array_map(function (string $name) use ($businessName, $team, $multiplier, $teamMtdIncome) {
                $memberSeed = "{$businessName}:sales-team:{$team['name']}:member:{$name}";
                $memberActivityFactor = $this->salesTeamActivityFactor($memberSeed);
                $memberIncomeFactor = $this->salesTeamIncomeFactor($memberSeed);

                return [
                    'name' => $name,
                    'reservations' => $this->scaled(68, $multiplier, $memberActivityFactor),
                    'done_reservations' => $this->scaled(54, $multiplier, $memberActivityFactor),
                    'calls' => $this->scaled(155, $multiplier, $memberActivityFactor),
                    'answered_calls' => $this->scaled(125, $multiplier, $memberActivityFactor),
                    'income' => $this->scaledMoney((int) round($teamMtdIncome / 2.5), $multiplier, $memberIncomeFactor),
                ];
            }, $team['members']);

            return [
                'name' => $team['name'],
                'reservations' => $reservations,
                'done_reservations' => $doneReservations,
                'calls' => $calls,
                'answered_calls' => $answeredCalls,
                'income' => $income,
                'members_count' => count($members),
                'members' => $members,
            ];
        }, $teams);
    }
}
